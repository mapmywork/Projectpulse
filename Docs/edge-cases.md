# Project Pulse MVP — Page-by-Page Edge Cases & Corner Scenarios

> **Purpose:** Document the known limitations, missing features, and failure modes for every single page in our current React MVP. 
> This is crucial for the hackathon pitch: acknowledging these gaps shows the judges that we are thinking about production readiness and clinical safety, not just building a happy-path demo.

---

## 1. Login Page (`/`)
**What it does:** Simple role-based login (Son, Doctor, Coordinator).

### What is Missing / Fails:
* **Hardcoded Credentials:** The MVP accepts static access codes (e.g., `SON2026`). There is no actual database verification of passwords.
* **No Authentication Tokens:** We use `localStorage` to store the user role. There are no secure JWT tokens, meaning anyone could technically manipulate `localStorage` to gain access.
* **No "Forgot Password" or 2FA:** In a real healthcare app, 2FA (OTP via SMS) is mandatory for DPDP compliance.
* **Edge Case - Brute Force:** A malicious user could easily script a brute-force attack on the static 4-digit or 7-character access codes.

---

## 2. Son Dashboard (`/son`)
**What it does:** Shows Arjun his father's medicine adherence, alerts, and DPDP verified status.

### What is Missing / Fails:
* **Missing Historical Data:** The dashboard only shows "Today's Medicines" and a generic "Weekly Adherence" percentage. There is no calendar view for the son to see exactly which days were missed.
* **Static Adherence Math:** The percentage is calculated from static seed data rather than dynamically rolling up the exact doses taken vs. missed in the last 7 days.
* **Edge Case - Concurrent Updates:** If Ramesh marks a dose as taken on WhatsApp exactly when the Son's dashboard polls the server, there might be a 5-second delay before the UI reflects it.
* **Edge Case - Revoked Consent:** If Ramesh suddenly revokes his DPDP consent, the MVP does not gracefully handle hiding the dashboard data. It would require a page reload and backend logic to block the API response.

---

## 3. Patient WhatsApp Simulator (`/patient-whatsapp`)
**What it does:** Simulates the Meta API WhatsApp experience for Ramesh, including DPDP consent, meal logging, and distress keywords.

### What is Missing / Fails:
* **No True Persistence:** If Ramesh refreshes the `/patient-whatsapp` page, the chat history disappears. (It is stored in React state, not fetched from the DB, unlike the Care Team chat).
* **Hardcoded Bot Replies:** The bot uses simple `if/else` logic (`if optionId === 'dose_taken'`). It lacks a true NLP engine (like Dialogflow) to handle unexpected text.
* **Edge Case - False Positive Distress:** If Ramesh types "Mausam ka chakkar hai" (The weather is crazy), the keyword "chakkar" triggers a severe medical distress alert to the coordinator.
* **Edge Case - Double Logging:** Ramesh can tap the "Le li ✅" button multiple times. In a production webhook, this must be made idempotent so the dose isn't logged twice.

---

## 4. Doctor Dashboard & Detail (`/doctor`, `/doctor/patient/:id`)
**What it does:** Shows a list of patients and detailed 90-day verified health data for Dr. Mehra.

### What is Missing / Fails:
* **Read-Only Prescriptions:** The doctor can see the medicines but cannot edit them or issue new prescriptions through the UI.
* **No Graphing/Charts:** Vitals (like BP or HbA1c) are displayed as static text or simple arrays. A real MVP needs line charts to show longitudinal trends over 90 days.
* **Edge Case - Multi-Doctor Overlap:** If a patient has two doctors (e.g., an endocrinologist and a cardiologist), the MVP does not restrict which doctor sees which data.
* **Edge Case - Un-resolving Alerts:** When a doctor clicks "Reviewed" on an alert, it acknowledges it, but it does not remove the alert from the Coordinator's queue, potentially causing duplicate work.

---

## 5. Care Team Chat (`/chat`)
**What it does:** A unified group chat connecting the Son, Coordinator, and Doctor. Allows generating a Weekly Report.

### What is Missing / Fails:
* **No Real-Time WebSockets:** The chat relies on HTTP polling (`setInterval` every 2 seconds). This is inefficient and causes slight delays compared to true WhatsApp/Socket.io real-time chat.
* **Static Report Generation:** The "Generate Weekly Report" demo button injects a hardcoded text string rather than dynamically calculating the patient's actual weekly stats from the SQL database.
* **Edge Case - Off-Hours Messaging:** If the Son sends a message to the Doctor at 2 AM, there is no automated "Out of Office" auto-responder.
* **Edge Case - Missing Push Notifications:** Users must have the web app open to see new messages. There are no browser or OS-level push notifications for urgent chat pings.

---

## 6. Coordinator Dashboard (`/coordinator`)
**What it does:** Shows a triage queue of active patient alerts (missed doses, emergencies).

### What is Missing / Fails:
* **No True Actioning:** The coordinator can see alerts, but there is no "Call Patient" integrated VoIP button or "Mark as Resolved" button to remove the alert from the queue in the UI.
* **Missing Audit Trail:** If a coordinator handles an emergency, there is no text box to write clinical notes (e.g., "Called Ramesh, it was just a cold").
* **Edge Case - Alert Flooding:** If a patient misses 3 doses and triggers a keyword distress alert on the same day, the dashboard shows 4 separate alerts instead of grouping them by patient, overwhelming the coordinator.
* **Edge Case - Unavailability:** If the coordinator's internet drops, there is no automatic escalation (e.g., SMS fallback) to ensure the emergency is still handled by a backup agent.

---

## Summary for Judges
If a judge asks about limitations, use this exact framing:
*"Because this is a 24-hour hackathon, we built the Happy Path to prove the concept. However, we have already documented our Edge Cases. For example, our WhatsApp bot currently uses basic keyword matching, which could lead to false-positive emergency alerts. In production, we would route all free-text responses through a lightweight NLP model to distinguish between 'Mujhe chakkar aa raha hai' (Emergency) and 'Mausam ka chakkar hai' (Safe). We prioritize clinical safety over demo magic."*
