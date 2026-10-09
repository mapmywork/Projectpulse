import { Router } from 'express';
import pool from '../db.js';
import { sendText, sendInteractiveButtons } from './whatsapp.js';

const router = Router();

// GET /webhook — Meta verification handshake
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified!');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// POST /webhook — Receive inbound messages from Ramesh
router.post('/', async (req, res) => {
  // Always respond 200 immediately (Meta requirement)
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return; // Not a message event (could be status update)

    const from = message.from;  // e.g., "919876543210"
    const type = message.type;  // "text", "interactive", "button"

    console.log(`Received ${type} message from ${from}`);

    // Handle interactive button replies (medicine taken/not yet)
    if (type === 'interactive') {
      const buttonId = message.interactive?.button_reply?.id;

      if (buttonId === 'accept_invite') {
        await pool.query(`
          UPDATE patients SET onboarding_status = 'completed' WHERE id = 1
        `);
        await sendText(from, 'Dhanyawad Ramesh ji! Aapka setup complete ho gaya hai. Hum aapko dawai aur khane yaad dilate rahenge.');
        console.log('Invite accepted by Ramesh');
      }

      if (buttonId === 'decline_invite') {
        await sendText(from, 'Theek hai Ramesh ji. Koi jankari share nahi ki jayegi.');
        console.log('Invite declined by Ramesh');
      }

      if (buttonId === 'start_routine') {
        await sendText(from, 'Bahut badiya Ramesh ji! Aaj se hum roz aapko dawai aur khane ka yaad dilayenge.');
        console.log('Routine started by Ramesh');

        // Demo Magic Part 3: Send first medicine reminder 5 seconds later
        setTimeout(async () => {
          try {
            await sendInteractiveButtons(from,
              'Ramesh ji, aaj subah ki dawai (Metformin 500mg) li ki nahi?',
              [
                { id: 'dose_taken', title: 'Le li' },
                { id: 'dose_later', title: 'Baad mein' },
                { id: 'feeling_unwell', title: 'Tabiyat theek nahi' }
              ]
            );
            console.log('Simulated first medicine reminder sent 5s later');
          } catch (e) {
            console.error('Error sending medicine reminder', e);
          }
        }, 5000);
      }

      if (buttonId === 'dose_taken') {
        // Mark the latest pending dose as taken
        await pool.query(`
          UPDATE doses SET status = 'taken', confirmed_at = NOW()
          WHERE id = (
            SELECT id FROM doses 
            WHERE patient_id = 1 AND status = 'pending'
            ORDER BY scheduled_at DESC LIMIT 1
          )
        `);
        await sendText(from, 'Bahut accha Ramesh ji! Dawai le li. Keep it up!');
        console.log('Dose marked as taken');
      }

      if (buttonId === 'dose_later') {
        await sendText(from, 'Theek hai Ramesh ji. Ek ghante mein phir yaad dilayenge.');
        console.log('Dose snoozed — will re-nudge later');
      }

      if (buttonId === 'feeling_unwell') {
        // Create emergency
        await pool.query(`
          INSERT INTO emergencies (patient_id, type, context, severity)
          VALUES (1, 'feeling_unwell', 'Ramesh tapped feeling unwell button', 'medium')
        `);
        await sendText(from, 'Ramesh ji, aapki baat sunne ke liye coordinator aapko call karenge. Fikar mat kijiye.');
        console.log('Emergency created — feeling unwell');
      }

      if (buttonId.startsWith('try_swap_')) {
        const mealId = buttonId.replace('try_swap_', '');
        await pool.query(`
          UPDATE meals 
          SET swap_accepted = TRUE 
          WHERE patient_id = 1 AND plate = $1
        `, [mealId]); // Simple update for the hackathon demo
        await sendText(from, 'Great! The meal and the swap are counted for your weekly summary.');
        console.log(`Swap accepted for: ${mealId}`);
      }

      if (buttonId === 'skip_swap') {
        await sendText(from, 'No problem! Noted.');
      }
    }

    // Handle quick reply (meal selection)
    if (type === 'interactive' && message.interactive?.list_reply) {
      const mealId = message.interactive.list_reply.id;
      const mealTitle = message.interactive.list_reply.title;

      // Map meal to swap suggestion
      const swaps = {
        'aloo_paratha': { swap: 'moong dal cheela', msg: 'Agar paratha ki jagah moong dal cheela banaye to sugar ke liye accha hoga.' },
        'dal_rice': { swap: 'brown rice + dal', msg: 'White chawal ki jagah brown rice ya daliya try karein. Sugar kam badhta hai.' },
        'rajma_chawal': { swap: 'less chawal + extra salad', msg: 'Chawal ki matra thodi kam karke salad aur badha lein.' },
        'khichdi': { swap: null, msg: 'Bahut accha! Khichdi sugar ke liye best hai.' },
        'roti_sabzi': { 
          swap: 'one less roti + extra sabzi', 
          msg: 'Thank you! Ek chhoti si salaah: kya aap ek roti kam karke, ek katori sabzi ya dal aur kha sakte hain?',
          interactive: true
        },
        'other_meal': { swap: null, msg: 'Thank you! Logged.' }
      };

      const swap = swaps[mealId] || { swap: null, msg: 'Accha choice!' };

      await pool.query(`
        INSERT INTO meals (patient_id, meal_type, plate, swap_offered, swap_accepted)
        VALUES (1, 'lunch', $1, $2, FALSE)
      `, [mealId, swap.swap]);

      if (swap.interactive) {
        await sendInteractiveButtons(from, swap.msg, [
          { id: 'try_swap_' + mealId, title: "I'll try this" },
          { id: 'skip_swap', title: "No thanks" }
        ]);
      } else {
        await sendText(from, swap.msg);
      }
      console.log(`Meal logged: ${mealId}`);
    }

    // Handle free text — check for distress keywords
    if (type === 'text') {
      const text = message.text.body.toLowerCase();
      const distressWords = ['chakkar', 'gir gaya', 'behosh', 'dard', 'dar lag', 'tabiyat kharab'];

      const isDistress = distressWords.some(word => text.includes(word));

      if (isDistress) {
        await pool.query(`
          INSERT INTO emergencies (patient_id, type, context, severity)
          VALUES (1, 'distress_keyword', $1, 'medium')
        `, [`Free text: "${message.text.body}"`]);
        await sendText(from, 'Ramesh ji, aapki baat sunne ke liye coordinator aapko call karenge. Fikar mat kijiye.');
        console.log('Distress keyword detected — emergency created');
      } else {
        // Log to audit
        await pool.query(`
          INSERT INTO audit_log (patient_id, actor, action, detail)
          VALUES (1, 'patient', 'free_text', $1)
        `, [message.text.body]);
      }
    }

  } catch (err) {
    console.error('Webhook processing error:', err);
  }
});

export default router;
