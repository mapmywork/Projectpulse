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
    }

    // Handle quick reply (meal selection)
    if (type === 'interactive' && message.interactive?.list_reply) {
      const mealId = message.interactive.list_reply.id;
      const mealTitle = message.interactive.list_reply.title;

      // Map meal to swap suggestion
      const swaps = {
        'paratha': { swap: 'moong dal cheela', msg: 'Agar paratha ki jagah moong dal cheela banaye to sugar ke liye accha hoga.' },
        'chawal_dal': { swap: 'brown rice + dal', msg: 'White chawal ki jagah brown rice ya daliya try karein. Sugar kam badhta hai.' },
        'biryani': { swap: 'jeera rice + raita', msg: 'Biryani ki jagah jeera rice aur raita (chhota) try karein. Halka hota hai.' },
        'roti_sabzi': { swap: null, msg: 'Bahut accha choice! Roti sabzi healthy hai. Keep it up!' },
        'daliya': { swap: null, msg: 'Bahut accha! Daliya sugar ke liye best hai.' },
        'fruit': { swap: null, msg: 'Fresh fruit accha hai! Mango aur banana zyada mat khaiye.' }
      };

      const swap = swaps[mealId] || { swap: null, msg: 'Accha choice!' };

      await pool.query(`
        INSERT INTO meals (patient_id, meal_type, plate, swap_offered, swap_accepted)
        VALUES (1, 'lunch', $1, $2, FALSE)
      `, [mealId, swap.swap]);

      await sendText(from, swap.msg);
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
