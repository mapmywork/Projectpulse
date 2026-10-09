const args = process.argv.slice(2);
const action = args[0] || 'taken';

let payload = {};

// 1. Medicine Taken
if (action === 'taken') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "interactive",
      interactive: { button_reply: { id: "dose_taken", title: "Le li" } }
    }]}}]}]
  };
  console.log("Simulating: Ramesh tapped 'Le li' (Medicine Taken)");
} 
// 2. Medicine Later (Snooze)
else if (action === 'later') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "interactive",
      interactive: { button_reply: { id: "dose_later", title: "Baad mein" } }
    }]}}]}]
  };
  console.log("Simulating: Ramesh tapped 'Baad mein' (Snooze)");
} 
// 3. Feeling Unwell Emergency
else if (action === 'unwell') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "interactive",
      interactive: { button_reply: { id: "feeling_unwell", title: "Tabiyat theek nahi" } }
    }]}}]}]
  };
  console.log("Simulating: Ramesh tapped 'Tabiyat theek nahi' (Emergency)");
} 
// 4. Distress Text Emergency
else if (action === 'distress') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "text",
      text: { body: "Mujhe achanak chakkar aa raha hai" }
    }]}}]}]
  };
  console.log("Simulating: Ramesh typed 'chakkar aa raha hai' (Distress Keyword)");
}
// 5. Normal Text (Audit Log)
else if (action === 'text') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "text",
      text: { body: "Main theek hu beta, tv dekh raha hu" }
    }]}}]}]
  };
  console.log("Simulating: Ramesh typed normal text (Logged to Audit)");
}
// 6. Meal Selection (e.g., Paratha)
else if (action === 'meal_paratha') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "interactive",
      interactive: { list_reply: { id: "paratha", title: "Aloo Paratha" } }
    }]}}]}]
  };
  console.log("Simulating: Ramesh selected 'Aloo Paratha' for lunch");
}
// 7. Meal Selection (e.g., Daliya - Healthy)
else if (action === 'meal_healthy') {
  payload = {
    entry: [{ changes: [{ value: { messages: [{
      from: "916204400600", type: "interactive",
      interactive: { list_reply: { id: "daliya", title: "Daliya" } }
    }]}}]}]
  };
  console.log("Simulating: Ramesh selected 'Daliya' for lunch");
}
else {
  console.log("Unknown action. Valid actions: taken, later, unwell, distress, text, meal_paratha, meal_healthy");
  process.exit(1);
}

fetch('http://localhost:3000/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => {
  if(res.ok) console.log("✅ Webhook triggered successfully! Database updated.");
  else console.log("❌ Failed to trigger webhook", res.status);
})
.catch(err => console.error(err));
