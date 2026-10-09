import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const WA_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = process.env.WA_API_VERSION || 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`;

// ---- Helper Functions ----

export async function sendText(to, text) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    })
  });
  const data = await response.json();
  console.log('Sent text message:', data);
  return data;
}

export async function sendInteractiveButtons(to, bodyText, buttons) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map(b => ({
            type: 'reply',
            reply: { id: b.id, title: b.title }
          }))
        }
      }
    })
  });
  const data = await response.json();
  console.log('Sent interactive buttons:', data);
  return data;
}

// ---- Trigger Endpoints (for demo) ----

// POST /api/send-reminder — Send medicine reminder to Ramesh
router.post('/send-reminder', async (req, res) => {
  const to = process.env.RAMESH_PHONE;

  await sendInteractiveButtons(to,
    'Ramesh ji, subah ki dawai ka samay ho gaya hai.\nMetformin 500mg leni hai.',
    [
      { id: 'dose_taken', title: 'Le li' },
      { id: 'dose_later', title: 'Baad mein' },
      { id: 'feeling_unwell', title: 'Tabiyat theek nahi' }
    ]
  );

  res.json({ success: true, message: 'Reminder sent to Ramesh' });
});

// POST /api/send-meal-prompt — Send meal log prompt to Ramesh
router.post('/send-meal-prompt', async (req, res) => {
  const to = process.env.RAMESH_PHONE;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: 'Ramesh ji, dopahar ka khana kya khaya aaj?' },
        action: {
          button: 'Khana chunein',
          sections: [{
            title: 'Aaj ka khana',
            rows: [
              { id: 'paratha', title: 'Paratha', description: 'Aloo ya gobi paratha' },
              { id: 'chawal_dal', title: 'Chawal + Dal', description: 'White chawal aur dal' },
              { id: 'roti_sabzi', title: 'Roti + Sabzi', description: 'Chapati aur sabzi' },
              { id: 'biryani', title: 'Biryani / Pulao', description: 'Rice dish' },
              { id: 'daliya', title: 'Daliya / Oats', description: 'Healthy option' },
              { id: 'fruit', title: 'Fruit', description: 'Fresh fruit' }
            ]
          }]
        }
      }
    })
  });

  const data = await response.json();
  res.json({ success: true, message: 'Meal prompt sent', data });
});

// POST /api/send-progress — Send Day-90 progress message
router.post('/send-progress', async (req, res) => {
  const to = process.env.RAMESH_PHONE;

  await sendText(to,
    'Badhai ho Ramesh ji! Aapke 90 din pure hue.\n\n' +
    'Pehle: HbA1c 8.2\nAb: HbA1c 7.6\n\n' +
    '0.6 point kam hua! Dawai aur khana dono ka asar dikh raha hai.\n\n' +
    'Doctor Mehra bhi khush hain. Keep it up!'
  );

  res.json({ success: true, message: 'Progress message sent' });
});

// POST /api/send-wife-tips — Send meal tip to wife
router.post('/send-wife-tips', async (req, res) => {
  const to = process.env.RAMESH_PHONE; // Assuming we use same test phone for demo

  await sendText(to,
    '💡 *Is Hafte ki Family Tip*\n\n' +
    'Sunita ji, agar aloo paratha bana rahi hain to Ramesh ji ke liye ek-do moong dal cheela bhi bana dein. Sugar ke liye accha hota hai. Puri family ke liye healthy hai!\n\n' +
    'Sujhav:\n' +
    '❌ Aloo Paratha -> ✅ Moong Dal Cheela\n' +
    '❌ White Chawal -> ✅ Brown Rice / Daliya\n' +
    '❌ Biryani -> ✅ Jeera Rice + Raita\n' +
    '❌ Meetha -> ✅ Gud (small) or Fresh Fruit'
  );

  res.json({ success: true, message: 'Wife tips sent via WhatsApp' });
});

export default router;
