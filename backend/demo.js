
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const args = process.argv.slice(2);
const scenario = args[0] || 'happy_path';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runDemo() {
  if (scenario === 'happy_path') {
    console.log("🎬 SCENARIO 1: Happy Path (Medicine Taken)");
    console.log("1️⃣ Sending Medicine Reminder to phone...");
    await execPromise('curl -s -X POST http://localhost:3000/api/send-reminder');
    
    console.log("⏳ Waiting 8 seconds (Pretend Ramesh is reading the message)...");
    await sleep(8000);
    
    console.log("2️⃣ Simulating Ramesh tapping 'Le li'...");
    await execPromise('node simulate.js taken');
    
    console.log("✅ Demo Complete! Check your phone for the confirmation.");
  } 
  
  else if (scenario === 'emergency') {
    console.log("🎬 SCENARIO 2: Emergency (Feeling Unwell)");
    console.log("1️⃣ Sending Medicine Reminder to phone...");
    await execPromise('curl -s -X POST http://localhost:3000/api/send-reminder');
    
    console.log("⏳ Waiting 8 seconds (Pretend Ramesh is reading the message)...");
    await sleep(8000);
    
    console.log("2️⃣ Simulating Ramesh tapping 'Tabiyat theek nahi'...");
    await execPromise('node simulate.js unwell');
    
    console.log("✅ Demo Complete! Emergency logged and Coordinator alerted.");
  }

  else {
    console.log("Unknown scenario. Use: 'happy_path' or 'emergency'");
  }
}

runDemo();
