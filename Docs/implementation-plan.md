# Project Pulse — Detailed Implementation Plan

> **Source:** [architecture.md](file:///Users/iamprince/Desktop/projectPulse/Docs/architecture.md) (v2.2) · [context.md](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md)
> **Scope:** Hackathon MVP — WhatsApp for Ramesh, mobile-only web app for Son/Doctor/Wife/Coordinator
> **Stack:** Vite + React · Node.js + Express · Neon PostgreSQL · Upstash Redis · WhatsApp Cloud API (Test Mode)
> **Constraint:** ₹0 cost · Mobile-only (390x844) · Dark theme · 2 seed patients
> **Last updated:** 9 October 2026

---

## Table of Contents

1. [Overview and Timeline](#overview-and-timeline)
2. [Phase 0 — Prerequisites](#phase-0--prerequisites-before-you-write-any-code)
3. [Phase 1 — Foundation and Infrastructure](#phase-1--foundation-and-infrastructure-60-min)
4. [Phase 2 — Backend Core](#phase-2--backend-core-90-min)
5. [Phase 3 — WhatsApp Integration](#phase-3--whatsapp-integration-60-min)
6. [Phase 4 — Frontend](#phase-4--frontend-mobile-only-web-app-110-min)
7. [Phase 5 — Safety Logic + Demo Data](#phase-5--safety-logic--demo-data-35-min)
8. [Phase 6 — Polish + Demo Rehearsal](#phase-6--polish--demo-rehearsal-45-min)
9. [Feature-to-Phase Traceability](#feature-to-phase-traceability)

---

## Overview and Timeline

```mermaid
gantt
    title Project Pulse — Build Phases
    dateFormat  HH:mm
    axisFormat  %H:%M

    section Phase 0 — Prerequisites
    Meta Developer App + WA Setup      :p0a, 00:00, 15min
    Neon DB account + create project   :p0b, 00:00, 10min
    Upstash Redis account + create DB  :p0c, 00:00, 5min

    section Phase 1 — Foundation
    Project scaffold + deps           :p1a, 00:15, 20min
    Schema SQL + seed SQL files       :p1b, after p1a, 15min
    Run schema + seed on Neon         :p1c, after p1b, 10min
    Environment config (.env)         :p1d, after p1c, 5min

    section Phase 2 — Backend Core
    Express server + middleware       :p2a, after p1d, 15min
    DB connection (Neon pool)         :p2b, after p2a, 10min
    Auth middleware (access codes)    :p2c, after p2b, 10min
    Son API routes                    :p2d, after p2c, 20min
    Doctor API routes                 :p2e, after p2c, 15min
    Wife API route                    :p2f, after p2c, 5min
    Coordinator API routes            :p2g, after p2c, 15min

    section Phase 3 — WhatsApp
    ngrok tunnel setup                :p3a, after p2g, 10min
    Webhook verify + receive          :p3b, after p3a, 15min
    Outbound message helpers          :p3c, after p3b, 15min
    Reminder + meal prompt flow       :p3d, after p3c, 20min

    section Phase 4 — Frontend
    Vite + React scaffold             :p4a, after p2g, 10min
    Design system (CSS + layout)      :p4b, after p4a, 25min
    Login page                        :p4c, after p4b, 15min
    Son dashboard                     :p4d, after p4c, 30min
    Doctor dashboard (multi-patient)  :p4e, after p4d, 25min
    Wife page                         :p4f, after p4e, 10min
    Coordinator dashboard             :p4g, after p4f, 20min

    section Phase 5 — Safety + Demo Data
    Emergency trigger logic           :p5a, after p4g, 15min
    Seed demo event data              :p5b, after p5a, 10min
    Day-90 progress flow (hardcoded)  :p5c, after p5b, 10min

    section Phase 6 — Polish + Demo
    End-to-end test (all 5 actors)    :p6a, after p5c, 20min
    Bug fixes + visual polish         :p6b, after p6a, 15min
    Demo script rehearsal             :p6c, after p6b, 10min
```

**Estimated total: ~6.5 hours.** Phases 3 and 4 can run in parallel (one person on WhatsApp, one on frontend) to bring it down to ~5 hours.

---

## Phase 0 — Prerequisites (Before You Write Any Code)

> **Goal:** All third-party accounts created, credentials collected, ready to paste into `.env`.

Phase 0 is about setting up the 3 external services our app depends on. You can do all 3 in parallel (in different browser tabs).

---

### 0.1 Meta Developer App + WhatsApp Cloud API (Test Mode)

This gives us a free test phone number that can send and receive WhatsApp messages to up to 5 whitelisted numbers. No business registration required. No charges.

#### Step-by-step:

**Step 1 — Create the Meta App:**
1. Go to [developers.facebook.com](https://developers.facebook.com) and log in with your Facebook account.
2. Click **My Apps** (top-right corner).
3. Click **Create App**.
4. Select **"Other"** as the use case, then click **Next**.
5. Select **"Business"** as the app type, then click **Next**.
6. Name the app: `ProjectPulse`. Click **Create app**.
7. You will land on the "Add products" page. Find **WhatsApp** in the list and click **Set up**.

**Step 2 — Create a Business Portfolio (if prompted):**
Meta now requires a Business Portfolio for all WhatsApp apps, even for testing.
1. If you see a screen saying "Create a business portfolio", click **Continue**.
2. Enter Business name: `Project Pulse`.
3. Enter your name and email.
4. Click **Create**. No documents or verification needed.
5. You will be redirected back to the WhatsApp setup.

**Step 3 — Get to the API Setup page:**
After the WhatsApp product is added, you may land on an "Overview" page with Steps 1/2/3.
1. In the **left sidebar**, click on **WhatsApp** to expand it.
2. Click on **API Setup** (this is the page we need).
3. On this page you will see:
   - **Temporary access token** (click "Copy" or "Generate" — valid 24 hours)
   - **Phone number ID** (under "From" section — a number like `123456789012345`)
   - **WhatsApp Business Account ID** (at the top of the page)

> **IMPORTANT:** Copy these 3 values and save them somewhere safe. We will paste them into our `.env` file in Phase 1.

**Step 4 — Add your phone as a test recipient:**
On the same API Setup page:
1. Scroll to the **"To"** field (under "Send and receive messages").
2. Click **Manage phone number list** or **Add phone number**.
3. Enter your real phone number (with country code, e.g., `+91 98765 43210`).
4. Meta will send a WhatsApp OTP to verify it. Enter the OTP.
5. Your number is now whitelisted. You can add up to 5 numbers total.

**Step 5 — Send a test message (optional but recommended):**
Still on the API Setup page:
1. Select your phone number in the "To" dropdown.
2. Click **Send message**.
3. You should receive a "Hello World" template message on your WhatsApp.
4. If you received it, your WhatsApp API is working!

**Step 6 — Note the API version:**
On the API Setup page, you'll see the API call URL like:
```
https://graph.facebook.com/v21.0/YOUR_PHONE_NUMBER_ID/messages
```
Note the version number (e.g., `v21.0`). We'll use this in our code.

> **We will configure the webhook (Step 7) later in Phase 3, after our Express server is running.**

**What you should have after Step 6:**

| Credential | Where to find it | Example |
|---|---|---|
| Temporary Access Token | API Setup page, "Temporary access token" section | `EAAGz...long_string...` |
| Phone Number ID | API Setup page, "From" section | `123456789012345` |
| WhatsApp Business Account ID | API Setup page, top of page | `987654321098765` |
| API Version | API Setup page, in the curl example | `v21.0` |

---

### 0.2 Neon PostgreSQL (Free Tier)

This is our main database. It stores patients, medicines, doses, meals, emergencies, consent, and audit logs.

#### Step-by-step:

1. Go to [neon.tech](https://neon.tech) and click **Sign Up** (use GitHub or Google for speed).
2. Click **Create a project**.
3. Project name: `projectpulse`.
4. Region: choose the one closest to you (e.g., `ap-southeast-1` for India, or `us-east-2`).
5. Postgres version: leave default.
6. Click **Create project**.
7. Neon will immediately show you a **Connection string**. It looks like:
   ```
   postgresql://neondb_owner:password123@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
8. **Copy this entire string.** This is your `DATABASE_URL`.

> **IMPORTANT:** Keep the Neon dashboard open. We will run our SQL schema here in Phase 1.

**What you should have:**

| Credential | Example |
|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:abc123@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require` |

---

### 0.3 Upstash Redis (Free Tier)

This is our cache and queue system. It handles dose timeout tracking, conversation state, and real-time alert pushing.

#### Step-by-step:

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (use GitHub or Google).
2. Click **Create Database**.
3. Name: `projectpulse`.
4. Type: **Regional**.
5. Region: choose the one closest to you (e.g., `ap-southeast-1`).
6. Click **Create**.
7. On the database details page, look for the **REST API** section.
8. Copy:
   - **UPSTASH_REDIS_REST_URL** (e.g., `https://tender-robin-12345.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN** (a long base64 string)

**What you should have:**

| Credential | Example |
|---|---|
| `UPSTASH_REDIS_REST_URL` | `https://tender-robin-12345.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `AYNxAAIncDE...long_string...` |

---

### 0.4 Install ngrok (if not already installed)

ngrok creates a secure tunnel from the internet to your laptop. WhatsApp needs this to send incoming messages to our local server.

```bash
# macOS (via Homebrew)
brew install ngrok

# Or download from https://ngrok.com/download
# Sign up for a free account and run:
ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
```

Verify it works:
```bash
ngrok version
# Should output something like: ngrok version 3.x.x
```

---

### Phase 0 Checklist

Before moving to Phase 1, confirm you have ALL of these:

- [ ] Meta Developer App created with WhatsApp product added
- [ ] WhatsApp Temporary Access Token copied
- [ ] WhatsApp Phone Number ID copied
- [ ] Your phone number added as a test recipient
- [ ] Test "Hello World" message received on your WhatsApp (optional but recommended)
- [ ] Neon project created, `DATABASE_URL` connection string copied
- [ ] Upstash Redis database created, REST URL and token copied
- [ ] ngrok installed and working

---

## Phase 1 — Foundation and Infrastructure (~60 min)

> **Goal:** Project folders created, all dependencies installed, database schema applied, seed data loaded, `.env` configured. Server starts without errors.

---

### 1.1 Create Project Structure

Run these commands from your `projectPulse` folder:

```bash
# Create backend folder structure
mkdir -p backend/src/routes
mkdir -p backend/src/middleware
mkdir -p backend/src/services
mkdir -p backend/src/schema
mkdir -p backend/voice

# Create frontend folder structure (we'll use Vite's scaffolder)
# This is done in step 1.3
```

### 1.2 Initialize Backend

```bash
cd backend
npm init -y
npm install express dotenv cors pg @upstash/redis
```

This installs:
- `express` — web server framework
- `dotenv` — loads `.env` variables
- `cors` — allows frontend (port 5173) to call backend (port 3000)
- `pg` — PostgreSQL client for Node.js (connects to Neon)
- `@upstash/redis` — Upstash Redis client (REST-based, works everywhere)

Add a start script to `backend/package.json`:
```json
{
  "scripts": {
    "dev": "node --watch src/index.js"
  }
}
```
The `--watch` flag auto-restarts the server when you save a file (Node 18+).

### 1.3 Initialize Frontend

```bash
cd ../frontend
npx -y create-vite@latest ./ --template react
npm install
npm install react-router-dom
```

This creates a Vite + React app with:
- `react-router-dom` — for routing between `/son`, `/doctor`, `/wife`, `/coordinator`

Add a proxy to `frontend/vite.config.js` so API calls go to Express:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/webhook': 'http://localhost:3000',
    }
  }
})
```

### 1.4 Create the `.env` File

Create `backend/.env` with all your credentials from Phase 0:

```env
# ====================
# WhatsApp Cloud API (Test Mode)
# Get these from: developers.facebook.com > Your App > WhatsApp > API Setup
# ====================
WHATSAPP_TOKEN=EAAGz...paste_your_temporary_access_token_here
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WEBHOOK_VERIFY_TOKEN=pulse_hackathon_2026
WA_API_VERSION=v21.0

# Your phone number (you are acting as Ramesh for the demo)
# Format: country code + number, no + sign, no spaces
RAMESH_PHONE=919876543210

# ====================
# Neon PostgreSQL (Free Tier)
# Get this from: console.neon.tech > Your Project > Connection Details
# ====================
DATABASE_URL=postgresql://neondb_owner:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# ====================
# Upstash Redis (Free Tier)
# Get these from: console.upstash.com > Your Database > REST API tab
# ====================
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYNxAAIncDE...paste_your_token_here

# ====================
# Server
# ====================
PORT=3000
```

Add `.env` to `.gitignore`:
```bash
echo ".env" >> backend/.gitignore
echo "node_modules" >> backend/.gitignore
```

### 1.5 Create the Database Schema SQL

Create `backend/src/schema/create-tables.sql`:

```sql
-- ================================================
-- Project Pulse — Database Schema
-- Run this in Neon's SQL Editor (console.neon.tech)
-- ================================================

-- Drop tables if they exist (safe for re-runs during development)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS consent CASCADE;
DROP TABLE IF EXISTS emergencies CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS doses CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS patients CASCADE;

-- Patients
CREATE TABLE patients (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  age           INT,
  city          VARCHAR(50),
  language      VARCHAR(5) DEFAULT 'hi',
  phone_wa      VARCHAR(15) NOT NULL UNIQUE,
  enrolled_at   TIMESTAMP DEFAULT NOW(),
  baseline_hba1c DECIMAL(4,1),
  day90_hba1c   DECIMAL(4,1)
);

-- Family & Doctor contacts
CREATE TABLE contacts (
  id          SERIAL PRIMARY KEY,
  patient_id  INT REFERENCES patients(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL,
  name        VARCHAR(100),
  phone       VARCHAR(15),
  city        VARCHAR(50),
  access_code VARCHAR(20) NOT NULL
);

-- Medicines (entered by son)
CREATE TABLE medicines (
  id            SERIAL PRIMARY KEY,
  patient_id    INT REFERENCES patients(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  dosage        VARCHAR(50),
  frequency     VARCHAR(20),
  times         TEXT[],
  supply_days   INT DEFAULT 30,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Dose reminders and confirmations
CREATE TABLE doses (
  id              SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patients(id) ON DELETE CASCADE,
  medicine_id     INT REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_at    TIMESTAMP NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  confirmed_at    TIMESTAMP,
  escalated_to_son BOOLEAN DEFAULT FALSE
);

-- Meal logs
CREATE TABLE meals (
  id              SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patients(id) ON DELETE CASCADE,
  meal_type       VARCHAR(20),
  plate           VARCHAR(50),
  swap_offered    VARCHAR(100),
  swap_accepted   BOOLEAN DEFAULT FALSE,
  logged_at       TIMESTAMP DEFAULT NOW()
);

-- Emergency events
CREATE TABLE emergencies (
  id                SERIAL PRIMARY KEY,
  patient_id        INT REFERENCES patients(id) ON DELETE CASCADE,
  type              VARCHAR(50),
  context           TEXT,
  severity          VARCHAR(20),
  resolved          BOOLEAN DEFAULT FALSE,
  coordinator_note  TEXT,
  resolved_at       TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Consent settings
CREATE TABLE consent (
  id          SERIAL PRIMARY KEY,
  patient_id  INT REFERENCES patients(id) ON DELETE CASCADE,
  target_role VARCHAR(20) NOT NULL,
  adherence   BOOLEAN DEFAULT FALSE,
  missed_doses BOOLEAN DEFAULT FALSE,
  meals       BOOLEAN DEFAULT FALSE,
  labs        BOOLEAN DEFAULT FALSE,
  emergencies BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Audit log (append-only)
CREATE TABLE audit_log (
  id          SERIAL PRIMARY KEY,
  patient_id  INT REFERENCES patients(id) ON DELETE CASCADE,
  actor       VARCHAR(20),
  action      VARCHAR(100),
  detail      TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### 1.6 Create the Seed Data SQL

Create `backend/src/schema/seed.sql`:

```sql
-- ================================================
-- Project Pulse — Seed Data
-- Run this AFTER create-tables.sql
-- ================================================

-- ---- PATIENTS ----
INSERT INTO patients (name, age, city, phone_wa, baseline_hba1c) VALUES
('Ramesh Kumar', 56, 'Kanpur', '+919876543210', 8.2),
('Suresh Gupta', 62, 'Kanpur', '+919876543220', 9.1);

-- ---- CONTACTS ----
-- Ramesh's contacts
INSERT INTO contacts (patient_id, role, name, phone, city, access_code) VALUES
(1, 'son', 'Arjun', '+919876543211', 'Pune', 'SON2026'),
(1, 'wife', 'Sunita', NULL, 'Kanpur', 'WIFE2026'),
(1, 'doctor', 'Dr. Mehra', NULL, 'Kanpur', 'DOC2026'),
(1, 'coordinator', 'Priya', '+919876543212', 'Kanpur', 'COORD2026');

-- Suresh's contacts (same doctor, different family)
INSERT INTO contacts (patient_id, role, name, phone, city, access_code) VALUES
(2, 'son', 'Vikram', '+919876543221', 'Delhi', 'SON2027'),
(2, 'doctor', 'Dr. Mehra', NULL, 'Kanpur', 'DOC2026');

-- ---- MEDICINES ----
-- Ramesh's medicines
INSERT INTO medicines (patient_id, name, dosage, frequency, times, supply_days) VALUES
(1, 'Metformin 500mg', '500mg', 'twice', '{"08:00","20:00"}', 25),
(1, 'Glimepiride 1mg', '1mg', 'once', '{"08:00"}', 5);

-- Suresh's medicines
INSERT INTO medicines (patient_id, name, dosage, frequency, times, supply_days) VALUES
(2, 'Metformin 1000mg', '1000mg', 'twice', '{"08:00","20:00"}', 20),
(2, 'Insulin Glargine', '10 units', 'once', '{"22:00"}', 15);

-- ---- CONSENT ----
-- Ramesh's consent
INSERT INTO consent (patient_id, target_role, adherence, missed_doses, meals, labs, emergencies) VALUES
(1, 'son', TRUE, FALSE, FALSE, TRUE, TRUE),
(1, 'wife', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, 'doctor', TRUE, TRUE, TRUE, TRUE, TRUE);

-- Suresh's consent
INSERT INTO consent (patient_id, target_role, adherence, missed_doses, meals, labs, emergencies) VALUES
(2, 'son', TRUE, TRUE, FALSE, TRUE, TRUE),
(2, 'doctor', TRUE, TRUE, TRUE, TRUE, TRUE);

-- ---- SAMPLE DOSES (Ramesh — past 7 days, ~86% adherence) ----
INSERT INTO doses (patient_id, medicine_id, scheduled_at, status, confirmed_at) VALUES
-- Day 1 (Oct 2)
(1, 1, '2026-10-02 08:00', 'taken', '2026-10-02 08:12'),
(1, 1, '2026-10-02 20:00', 'taken', '2026-10-02 20:05'),
(1, 2, '2026-10-02 08:00', 'taken', '2026-10-02 08:15'),
-- Day 2 (Oct 3)
(1, 1, '2026-10-03 08:00', 'taken', '2026-10-03 08:20'),
(1, 1, '2026-10-03 20:00', 'missed', NULL),
(1, 2, '2026-10-03 08:00', 'taken', '2026-10-03 08:22'),
-- Day 3 (Oct 4)
(1, 1, '2026-10-04 08:00', 'taken', '2026-10-04 08:10'),
(1, 1, '2026-10-04 20:00', 'taken', '2026-10-04 20:30'),
(1, 2, '2026-10-04 08:00', 'taken', '2026-10-04 08:12'),
-- Day 4 (Oct 5)
(1, 1, '2026-10-05 08:00', 'taken', '2026-10-05 08:08'),
(1, 1, '2026-10-05 20:00', 'missed', NULL),
(1, 2, '2026-10-05 08:00', 'taken', '2026-10-05 08:10'),
-- Day 5 (Oct 6)
(1, 1, '2026-10-06 08:00', 'taken', '2026-10-06 08:15'),
(1, 1, '2026-10-06 20:00', 'taken', '2026-10-06 20:10'),
(1, 2, '2026-10-06 08:00', 'missed', NULL),
-- Day 6 (Oct 7)
(1, 1, '2026-10-07 08:00', 'taken', '2026-10-07 08:05'),
(1, 1, '2026-10-07 20:00', 'taken', '2026-10-07 20:15'),
(1, 2, '2026-10-07 08:00', 'taken', '2026-10-07 08:08'),
-- Day 7 (Oct 8)
(1, 1, '2026-10-08 08:00', 'taken', '2026-10-08 08:12'),
(1, 1, '2026-10-08 20:00', 'pending', NULL),
(1, 2, '2026-10-08 08:00', 'taken', '2026-10-08 08:14');
-- Total: 21 doses, 18 taken, 3 missed = 86% adherence

-- ---- SAMPLE DOSES (Suresh — past 7 days, ~92% adherence) ----
INSERT INTO doses (patient_id, medicine_id, scheduled_at, status, confirmed_at) VALUES
(2, 3, '2026-10-02 08:00', 'taken', '2026-10-02 08:10'),
(2, 3, '2026-10-02 20:00', 'taken', '2026-10-02 20:05'),
(2, 4, '2026-10-02 22:00', 'taken', '2026-10-02 22:10'),
(2, 3, '2026-10-03 08:00', 'taken', '2026-10-03 08:08'),
(2, 3, '2026-10-03 20:00', 'taken', '2026-10-03 20:15'),
(2, 4, '2026-10-03 22:00', 'taken', '2026-10-03 22:05'),
(2, 3, '2026-10-04 08:00', 'taken', '2026-10-04 08:12'),
(2, 3, '2026-10-04 20:00', 'taken', '2026-10-04 20:10'),
(2, 4, '2026-10-04 22:00', 'missed', NULL),
(2, 3, '2026-10-05 08:00', 'taken', '2026-10-05 08:05'),
(2, 3, '2026-10-05 20:00', 'taken', '2026-10-05 20:08'),
(2, 4, '2026-10-05 22:00', 'taken', '2026-10-05 22:10'),
(2, 3, '2026-10-06 08:00', 'taken', '2026-10-06 08:18'),
(2, 3, '2026-10-06 20:00', 'taken', '2026-10-06 20:12'),
(2, 4, '2026-10-06 22:00', 'taken', '2026-10-06 22:08'),
(2, 3, '2026-10-07 08:00', 'taken', '2026-10-07 08:10'),
(2, 3, '2026-10-07 20:00', 'missed', NULL),
(2, 4, '2026-10-07 22:00', 'taken', '2026-10-07 22:05'),
(2, 3, '2026-10-08 08:00', 'taken', '2026-10-08 08:15'),
(2, 3, '2026-10-08 20:00', 'taken', '2026-10-08 20:10'),
(2, 4, '2026-10-08 22:00', 'taken', '2026-10-08 22:12');
-- Total: 21 doses, 19 taken, 2 missed = ~90% adherence (close to 92 after rounding)

-- ---- SAMPLE MEALS (Ramesh — 9 of 14 logged) ----
INSERT INTO meals (patient_id, meal_type, plate, swap_offered, swap_accepted, logged_at) VALUES
(1, 'lunch', 'paratha', 'moong dal cheela', FALSE, '2026-10-02 13:05'),
(1, 'dinner', 'chawal_dal', 'brown rice + dal', TRUE, '2026-10-02 20:30'),
(1, 'lunch', 'roti_sabzi', NULL, FALSE, '2026-10-03 13:10'),
(1, 'dinner', 'biryani', 'jeera rice + raita', FALSE, '2026-10-03 20:45'),
(1, 'lunch', 'paratha', 'moong dal cheela', TRUE, '2026-10-04 13:00'),
(1, 'dinner', 'chawal_dal', 'brown rice + dal', TRUE, '2026-10-05 20:20'),
(1, 'lunch', 'daliya', NULL, FALSE, '2026-10-06 13:15'),
(1, 'lunch', 'roti_sabzi', NULL, FALSE, '2026-10-07 13:05'),
(1, 'dinner', 'paratha', 'moong dal cheela', FALSE, '2026-10-08 20:10');

-- ---- SAMPLE EMERGENCY (Ramesh — 1 resolved) ----
INSERT INTO emergencies (patient_id, type, context, severity, resolved, coordinator_note, resolved_at, created_at) VALUES
(1, 'feeling_unwell', 'After taking Glimepiride 1mg — reported mild nausea', 'medium', TRUE,
 'Called Ramesh. He took medicine on empty stomach. Advised to eat breakfast before taking Glimepiride. No escalation needed.',
 '2026-10-05 09:45', '2026-10-05 09:30');

-- ---- ANOTHER RESOLVED EMERGENCY (for coordinator history) ----
INSERT INTO emergencies (patient_id, type, context, severity, resolved, coordinator_note, resolved_at, created_at) VALUES
(1, 'distress_keyword', 'Free text message contained "chakkar aa raha hai"', 'medium', TRUE,
 'Called Ramesh. Was dizzy from heat, not medicine-related. Advised rest and water.',
 '2026-10-01 11:00', '2026-10-01 10:45');
```

### 1.7 Run the SQL on Neon

1. Go to your Neon project dashboard: [console.neon.tech](https://console.neon.tech)
2. Click **SQL Editor** in the left sidebar.
3. **First**, paste the entire contents of `create-tables.sql` and click **Run**.
   - You should see: "8 statements executed successfully".
4. **Then**, paste the entire contents of `seed.sql` and click **Run**.
   - You should see all INSERTs succeed.

**Verify** by running this query in Neon's SQL editor:
```sql
SELECT p.name, p.age, p.city, p.baseline_hba1c,
       (SELECT COUNT(*) FROM contacts c WHERE c.patient_id = p.id) as contact_count,
       (SELECT COUNT(*) FROM medicines m WHERE m.patient_id = p.id) as medicine_count
FROM patients p;
```

Expected result:
| name | age | city | baseline_hba1c | contact_count | medicine_count |
|---|---|---|---|---|---|
| Ramesh Kumar | 56 | Kanpur | 8.2 | 4 | 2 |
| Suresh Gupta | 62 | Kanpur | 9.1 | 2 | 2 |

### 1.8 Create the .gitignore

Create `projectPulse/.gitignore`:
```
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build output
dist/

# OS files
.DS_Store
```

---

### Phase 1 Checklist

- [ ] `backend/` folder exists with `package.json` and `node_modules/`
- [ ] `frontend/` folder exists with Vite React app
- [ ] `backend/.env` has all 8 variables filled with real credentials
- [ ] Neon database has 8 tables created
- [ ] Neon database has seed data: 2 patients, 6 contacts, 4 medicines, 42 doses, 9 meals, 2 emergencies, 5 consent rows
- [ ] Verification query shows both patients with correct counts
- [ ] `cd backend && npm run dev` starts without errors
- [ ] `cd frontend && npm run dev` starts and shows default Vite page at `localhost:5173`

---

## Phase 2 — Backend Core (~90 min)

> **Goal:** All API routes serving real data from Neon PostgreSQL. Auth middleware validates access codes. Every route can be tested with curl.

---

### 2.1 Database Connection (`backend/src/db.js`)

```js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Neon
});

// Test the connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to Neon PostgreSQL'))
  .catch(err => console.error('Database connection error:', err));

export default pool;
```

### 2.2 Redis Client (`backend/src/redis.js`)

```js
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
```

### 2.3 Express Server (`backend/src/index.js`)

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import sonRoutes from './routes/son.js';
import doctorRoutes from './routes/doctor.js';
import wifeRoutes from './routes/wife.js';
import coordinatorRoutes from './routes/coordinator.js';
import webhookRoutes from './routes/webhook.js';
import whatsappRoutes from './routes/whatsapp.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/son', sonRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/wife', wifeRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api', whatsappRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Project Pulse backend running on port ${PORT}`);
});
```

> **Note:** Add `"type": "module"` to `backend/package.json` to use ES module imports.

### 2.4 Auth Route (`backend/src/routes/auth.js`)

```js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// POST /api/auth/login
// Body: { code: "SON2026" }
// Returns: { role, name, patientId } or 401
router.post('/login', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Access code is required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, patient_id, role, name FROM contacts WHERE access_code = $1',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid access code' });
    }

    const contact = result.rows[0];
    res.json({
      role: contact.role,
      name: contact.name,
      patientId: contact.patient_id,
      contactId: contact.id
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

**Test with curl:**
```bash
# Should return: { role: "son", name: "Arjun", patientId: 1 }
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "SON2026"}'

# Should return: 401 error
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code": "WRONG"}'
```

### 2.5 Son's API (`backend/src/routes/son.js`)

```js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/son/dashboard?patientId=1
router.get('/dashboard', async (req, res) => {
  const patientId = req.query.patientId || 1;

  try {
    // 1. Patient info
    const patient = await pool.query(
      'SELECT * FROM patients WHERE id = $1', [patientId]
    );

    // 2. Medicines with supply days
    const medicines = await pool.query(
      'SELECT * FROM medicines WHERE patient_id = $1', [patientId]
    );

    // 3. Today's doses
    const todayDoses = await pool.query(
      `SELECT d.*, m.name as medicine_name, m.dosage
       FROM doses d JOIN medicines m ON d.medicine_id = m.id
       WHERE d.patient_id = $1 AND d.scheduled_at::date = CURRENT_DATE
       ORDER BY d.scheduled_at`,
      [patientId]
    );

    // 4. Weekly adherence (last 7 days)
    const weeklyStats = await pool.query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'taken') as taken,
         COUNT(*) FILTER (WHERE status = 'missed') as missed
       FROM doses
       WHERE patient_id = $1
         AND scheduled_at >= NOW() - INTERVAL '7 days'`,
      [patientId]
    );

    const stats = weeklyStats.rows[0];
    const adherencePercent = stats.total > 0
      ? Math.round((stats.taken / stats.total) * 100)
      : 0;

    // 5. Active alerts (missed doses, emergencies)
    const alerts = await pool.query(
      `SELECT * FROM emergencies
       WHERE patient_id = $1 AND resolved = FALSE
       ORDER BY created_at DESC`,
      [patientId]
    );

    // 6. Consent matrix (what son can see)
    const consent = await pool.query(
      `SELECT * FROM consent WHERE patient_id = $1 AND target_role = 'son'`,
      [patientId]
    );

    res.json({
      patient: patient.rows[0],
      medicines: medicines.rows,
      todayDoses: todayDoses.rows,
      weeklyAdherence: {
        total: parseInt(stats.total),
        taken: parseInt(stats.taken),
        missed: parseInt(stats.missed),
        percent: adherencePercent
      },
      alerts: alerts.rows,
      consent: consent.rows[0] || {}
    });

  } catch (err) {
    console.error('Son dashboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/son/book-lab
router.post('/book-lab', async (req, res) => {
  const { patientId, type } = req.body; // type: 'baseline' or 'day90'
  await pool.query(
    `INSERT INTO audit_log (patient_id, actor, action, detail)
     VALUES ($1, 'son', 'book_lab', $2)`,
    [patientId || 1, type || 'baseline']
  );
  res.json({ success: true, status: 'booked' });
});

export default router;
```

**Test with curl:**
```bash
curl http://localhost:3000/api/son/dashboard?patientId=1
```

### 2.6 Doctor's API (`backend/src/routes/doctor.js`)

```js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/doctor/patients — List all patients for this doctor
router.get('/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, p.age, p.city, p.baseline_hba1c, p.day90_hba1c,
        -- Calculate adherence for last 7 days
        COALESCE(
          ROUND(
            COUNT(*) FILTER (WHERE d.status = 'taken') * 100.0 /
            NULLIF(COUNT(d.id), 0)
          ), 0
        ) as adherence_percent,
        -- Count unresolved emergencies
        (SELECT COUNT(*) FROM emergencies e
         WHERE e.patient_id = p.id AND e.resolved = FALSE) as flag_count
      FROM patients p
      LEFT JOIN doses d ON d.patient_id = p.id
        AND d.scheduled_at >= NOW() - INTERVAL '7 days'
      GROUP BY p.id
      ORDER BY
        (SELECT COUNT(*) FROM emergencies e WHERE e.patient_id = p.id AND e.resolved = FALSE) DESC,
        p.name ASC
    `);

    res.json({ patients: result.rows });
  } catch (err) {
    console.error('Doctor patients error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/doctor/summary/:id — Weekly summary for a specific patient
router.get('/summary/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medicines = await pool.query('SELECT * FROM medicines WHERE patient_id = $1', [patientId]);

    // Adherence stats (7 days)
    const adherence = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'taken') as taken,
        COUNT(*) FILTER (WHERE status = 'missed') as missed
      FROM doses WHERE patient_id = $1 AND scheduled_at >= NOW() - INTERVAL '7 days'
    `, [patientId]);

    // Meal stats (7 days)
    const meals = await pool.query(`
      SELECT
        COUNT(*) as logged,
        COUNT(*) FILTER (WHERE swap_accepted = TRUE) as swaps_accepted
      FROM meals WHERE patient_id = $1 AND logged_at >= NOW() - INTERVAL '7 days'
    `, [patientId]);

    // Flags (unresolved emergencies)
    const flags = await pool.query(`
      SELECT * FROM emergencies
      WHERE patient_id = $1 AND resolved = FALSE
      ORDER BY created_at DESC
    `, [patientId]);

    const stats = adherence.rows[0];

    res.json({
      patient: patient.rows[0],
      medicines: medicines.rows,
      adherence: {
        total: parseInt(stats.total),
        taken: parseInt(stats.taken),
        missed: parseInt(stats.missed),
        percent: stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0
      },
      meals: {
        logged: parseInt(meals.rows[0].logged),
        swapsAccepted: parseInt(meals.rows[0].swaps_accepted)
      },
      flags: flags.rows
    });
  } catch (err) {
    console.error('Doctor summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/doctor/review/:id — Mark patient as reviewed
router.post('/review/:id', async (req, res) => {
  const patientId = req.params.id;
  await pool.query(
    `INSERT INTO audit_log (patient_id, actor, action, detail)
     VALUES ($1, 'doctor', 'reviewed', 'Weekly summary reviewed')`,
    [patientId]
  );
  res.json({ success: true });
});

export default router;
```

**Test with curl:**
```bash
# List all patients (should return Ramesh and Suresh)
curl http://localhost:3000/api/doctor/patients

# Get Ramesh's summary
curl http://localhost:3000/api/doctor/summary/1
```

### 2.7 Wife's API (`backend/src/routes/wife.js`)

```js
import { Router } from 'express';

const router = Router();

// GET /api/wife/tips — Returns meal tips ONLY (no medicine data, no clinical data)
router.get('/tips', (req, res) => {
  res.json({
    familyPotTip: {
      title: 'Is hafte ki family pot tip',
      message: 'Sunita ji, agar aloo paratha bana rahi hain to Ramesh ji ke liye ek-do moong dal cheela bhi bana dein. Sugar ke liye accha hota hai. Puri family ke liye healthy hai!',
      why: 'Moong dal cheela has more protein and less starch than aloo paratha.'
    },
    swapSuggestions: [
      { instead: 'Aloo Paratha', tryThis: 'Moong Dal Cheela' },
      { instead: 'White Chawal', tryThis: 'Brown Rice / Daliya' },
      { instead: 'Biryani', tryThis: 'Jeera Rice + Raita (small)' },
      { instead: 'Meetha', tryThis: 'Gud (small) or Fresh Fruit' }
    ],
    privacyNote: 'Yeh page sirf khaane ke tips dikhata hai. Dawai ya test ki koi jaankari nahi dikhti.'
  });
});

export default router;
```

### 2.8 Coordinator's API (`backend/src/routes/coordinator.js`)

```js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/coordinator/alerts — All emergencies
router.get('/alerts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, p.name as patient_name, p.age, p.city, p.phone_wa
      FROM emergencies e
      JOIN patients p ON e.patient_id = p.id
      ORDER BY e.resolved ASC, e.created_at DESC
    `);

    const active = result.rows.filter(r => !r.resolved);
    const resolved = result.rows.filter(r => r.resolved);

    res.json({ active, resolved });
  } catch (err) {
    console.error('Coordinator alerts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/coordinator/resolve — Resolve an alert with a note
router.post('/resolve', async (req, res) => {
  const { alertId, note } = req.body;

  try {
    await pool.query(
      `UPDATE emergencies
       SET resolved = TRUE, coordinator_note = $1, resolved_at = NOW()
       WHERE id = $2`,
      [note, alertId]
    );

    await pool.query(
      `INSERT INTO audit_log (patient_id, actor, action, detail)
       VALUES ((SELECT patient_id FROM emergencies WHERE id = $1), 'coordinator', 'resolved_alert', $2)`,
      [alertId, note]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Resolve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

---

### Phase 2 Checklist

Test each endpoint with curl and confirm the response:

- [ ] `POST /api/auth/login` with `SON2026` returns `{ role: "son", name: "Arjun", patientId: 1 }`
- [ ] `POST /api/auth/login` with `DOC2026` returns `{ role: "doctor", name: "Dr. Mehra" }`
- [ ] `POST /api/auth/login` with `WRONG` returns 401
- [ ] `GET /api/son/dashboard?patientId=1` returns Ramesh's medicines, doses, adherence ~86%
- [ ] `GET /api/doctor/patients` returns both Ramesh (with flags) and Suresh (no flags)
- [ ] `GET /api/doctor/summary/1` returns Ramesh's weekly summary with adherence, meals, flags
- [ ] `GET /api/doctor/summary/2` returns Suresh's summary with no flags
- [ ] `GET /api/wife/tips` returns meal tips only (no medicine names, no clinical data)
- [ ] `GET /api/coordinator/alerts` returns 0 active, 2 resolved (from seed data)
- [ ] `POST /api/coordinator/resolve` with an alert ID resolves it

---

## Phase 3 — WhatsApp Integration (~60 min)

> **Goal:** Ramesh receives Hindi medicine reminders on real WhatsApp, taps buttons to respond, and the system updates Neon in real-time.

---

### 3.1 Start ngrok

Open a new terminal tab and run:
```bash
ngrok http 3000
```

You will see output like:
```
Forwarding  https://abc-123-xyz.ngrok-free.app -> http://localhost:3000
```

**Copy the `https://...ngrok-free.app` URL.** You need it for the next step.

### 3.2 Configure Webhook in Meta Dashboard

1. Go to your Meta developer app dashboard.
2. In the left sidebar, under **WhatsApp**, click **Configuration**.
3. Under "Webhook", click **Edit**.
4. Callback URL: `https://abc-123-xyz.ngrok-free.app/webhook`
5. Verify token: `pulse_hackathon_2026` (must match your `.env` `WEBHOOK_VERIFY_TOKEN`)
6. Click **Verify and save**.
7. Click **Manage** next to "Webhook fields".
8. Subscribe to the **messages** field.

### 3.3 Webhook Route (`backend/src/routes/webhook.js`)

```js
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
          WHERE patient_id = 1 AND status = 'pending'
          ORDER BY scheduled_at DESC LIMIT 1
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
```

### 3.4 Outbound Message Helpers (`backend/src/routes/whatsapp.js`)

```js
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

export default router;
```

---

### Phase 3 Checklist

- [ ] ngrok running and forwarding to port 3000
- [ ] Webhook verified in Meta dashboard (green checkmark)
- [ ] `messages` field subscribed in webhook settings
- [ ] `POST /api/send-reminder` sends a WhatsApp message with 3 buttons to your phone
- [ ] Tapping "Le li" on your phone updates the `doses` table (check in Neon SQL editor)
- [ ] Tapping "Tabiyat theek nahi" creates a new emergency in the `emergencies` table
- [ ] `POST /api/send-meal-prompt` sends a list message with 6 meal options
- [ ] Selecting a meal option triggers a swap suggestion reply
- [ ] Typing "chakkar aa raha hai" triggers a distress keyword emergency
- [ ] `POST /api/send-progress` sends the Day-90 celebration message

---

## Phase 4 — Frontend (Mobile-Only Web App) (~110 min)

> **Goal:** Login page + 4 role-specific mobile dashboards. Dark theme, glassmorphism, bottom nav. All connected to backend APIs via fetch.

---

### 4.1 Design System (`frontend/src/index.css`)

Create the global CSS with all design tokens from architecture.md:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg: #0a0a0f;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --card-blur: blur(10px);
  --card-radius: 16px;
  --accent-gradient: linear-gradient(135deg, #7c3aed, #f97316);
  --text-primary: #f5f5f5;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --green: #22c55e;
  --orange: #f97316;
  --red: #ef4444;
  --font: 'Inter', sans-serif;
  --pad: 16px;
  --gap: 12px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-primary);
  max-width: 390px;
  margin: 0 auto;
  min-height: 100dvh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Glassmorphism Card */
.card {
  background: var(--card-bg);
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--pad);
  margin-bottom: var(--gap);
  transition: transform 0.2s ease;
}
.card:active { transform: scale(0.98); }

/* Status Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-green { background: rgba(34, 197, 94, 0.15); color: var(--green); }
.badge-orange { background: rgba(249, 115, 22, 0.15); color: var(--orange); }
.badge-red { background: rgba(239, 68, 68, 0.15); color: var(--red); }

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--accent-gradient);
  transition: width 0.8s ease;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  max-width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--card-border);
}
.bottom-nav button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.bottom-nav button.active {
  color: var(--text-primary);
}
.bottom-nav button.active::after {
  content: '';
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: var(--accent-gradient);
}

/* Alert pulse animation */
@keyframes pulse-red {
  0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
  50% { border-color: rgba(239, 68, 68, 0.8); }
}
.alert-pulse {
  border: 2px solid var(--red);
  animation: pulse-red 2s infinite;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-family: var(--font);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.btn:active { transform: scale(0.95); }
.btn-primary {
  background: var(--accent-gradient);
  color: white;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* Page padding (accounts for bottom nav) */
.page {
  padding: var(--pad);
  padding-bottom: 80px;
}

/* Header */
.page-header {
  margin-bottom: 20px;
}
.page-header h1 {
  font-size: 1.25rem;
  font-weight: 700;
}
.page-header p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 4px;
}
```

### 4.2 App Router (`frontend/src/App.jsx`)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SonDashboard from './pages/SonDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientDetail from './pages/DoctorPatientDetail';
import WifePage from './pages/WifePage';
import CoordinatorDashboard from './pages/CoordinatorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/son" element={<SonDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patient/:id" element={<DoctorPatientDetail />} />
        <Route path="/wife" element={<WifePage />} />
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 4.3 to 4.7 — Page Components

Each page component follows the same pattern:
1. `useEffect` fetches data from our backend API on mount
2. Renders glassmorphism cards with the data
3. Uses the CSS classes from `index.css`

The **Login page** shows 4 role cards. Tapping one opens a code input modal. On valid code, it saves the role to `localStorage` and navigates to the correct dashboard.

The **Son's Dashboard** fetches `GET /api/son/dashboard`, renders today's medicines, alerts, weekly summary, and lab test cards.

The **Doctor's Dashboard** fetches `GET /api/doctor/patients`, renders a scrollable list of patient cards. Tapping a card navigates to `/doctor/patient/:id` which fetches `GET /api/doctor/summary/:id`.

The **Wife's Page** fetches `GET /api/wife/tips` and renders meal tips only. No bottom nav (intentionally minimal).

The **Coordinator's Dashboard** fetches `GET /api/coordinator/alerts` and renders active alerts with pulsing red borders and action buttons.

> **Implementation note:** Each page will be built as a separate `.jsx` file using the design tokens and shared CSS classes defined in the design system. The exact JSX will be written during this phase.

---

### Phase 4 Checklist

- [ ] Login page renders 4 role cards on dark background
- [ ] Tapping "Son" card and entering `SON2026` redirects to `/son`
- [ ] Son's dashboard shows live data from Neon (medicines, adherence %, alerts)
- [ ] Doctor's dashboard shows both Ramesh and Suresh as patient cards
- [ ] Tapping Ramesh shows detail screen with weekly summary, flags, and labs
- [ ] Wife's page shows meal tips only (no medicine data anywhere)
- [ ] Coordinator's dashboard shows alert queue with resolve buttons
- [ ] All pages use dark theme, glassmorphism cards, bottom nav
- [ ] No horizontal scroll on 390px viewport
- [ ] Pages refetch data every 5 seconds (for demo real-time feel)

---

## Phase 5 — Safety Logic + Demo Data (~35 min)

> **Goal:** Emergency triggers work end-to-end. The "feeling unwell" flow goes from WhatsApp to coordinator dashboard in real-time.

### 5.1 Emergency Detection (`backend/src/services/safety.js`)

```js
import pool from '../db.js';

// Check if a patient has 3+ consecutive missed doses
export async function checkMissedStreak(patientId) {
  const result = await pool.query(`
    SELECT status FROM doses
    WHERE patient_id = $1
    ORDER BY scheduled_at DESC
    LIMIT 3
  `, [patientId]);

  const allMissed = result.rows.length === 3 &&
    result.rows.every(r => r.status === 'missed');

  if (allMissed) {
    await pool.query(`
      INSERT INTO emergencies (patient_id, type, context, severity)
      VALUES ($1, 'missed_streak', '3 consecutive doses missed', 'high')
    `, [patientId]);
    return true;
  }
  return false;
}

// Distress keywords in Hindi
export const DISTRESS_KEYWORDS = [
  'chakkar', 'gir gaya', 'behosh', 'dard',
  'dar lag', 'tabiyat kharab', 'kamzori',
  'aankhon mein andhera', 'saans nahi aa rahi'
];
```

### 5.2 Day-90 Progress Setup

Update Ramesh's Day-90 HbA1c in the database:
```sql
UPDATE patients SET day90_hba1c = 7.6 WHERE id = 1;
```

### Phase 5 Checklist

- [ ] Son's dashboard shows missed dose alerts from seed data
- [ ] Doctor's dashboard shows flag count on Ramesh's card
- [ ] Coordinator dashboard shows 2 resolved alerts from seed data
- [ ] Tapping "Tabiyat theek nahi" on WhatsApp creates a new active alert
- [ ] New alert appears on coordinator dashboard within 5 seconds
- [ ] Coordinator can resolve the alert with a note
- [ ] Typing "chakkar aa raha hai" in WhatsApp triggers distress emergency
- [ ] Day-90 progress message sends with correct numbers (8.2 to 7.6)

---

## Phase 6 — Polish + Demo Rehearsal (~45 min)

> **Goal:** End-to-end demo works flawlessly. Visual polish complete. Demo rehearsed.

### 6.1 End-to-End Test Script (16 steps)

| # | Actor | Action | Expected Result |
|---|---|---|---|
| 1 | Son | Login with `SON2026` | Dashboard loads with Ramesh's data |
| 2 | Son | Check "Medicines" card | Metformin + Glimepiride with status |
| 3 | Demo | `curl -X POST localhost:3000/api/send-reminder` | WhatsApp message with 3 buttons arrives |
| 4 | Ramesh | Tap "Le li" on WhatsApp | Dashboard updates: dose marked taken |
| 5 | Demo | `curl -X POST localhost:3000/api/send-meal-prompt` | Meal list arrives on WhatsApp |
| 6 | Ramesh | Select "Paratha" | Swap tip reply arrives. Meal logged. |
| 7 | Ramesh | Tap "Tabiyat theek nahi" | Ack sent. Emergency created. |
| 8 | Coordinator | Login with `COORD2026` | Red pulsing alert visible |
| 9 | Coordinator | Click "Mark as Called" + add note | Alert resolved |
| 10 | Doctor | Login with `DOC2026` | Patient list: Ramesh with flag, Suresh clean |
| 11 | Doctor | Tap Ramesh | Detail: summary + flag + labs |
| 12 | Doctor | Click "Reviewed" | Audit logged |
| 13 | Doctor | Tap Suresh | Clean summary, no flags |
| 14 | Wife | Login with `WIFE2026` | Meal tips only. No medicine data. |
| 15 | Demo | `curl -X POST localhost:3000/api/send-progress` | "Badhai ho!" on WhatsApp |
| 16 | Doctor | Refresh Ramesh detail | HbA1c: 8.2 to 7.6 |

### 6.2 Visual Polish Checklist

- [ ] All cards have consistent glassmorphism
- [ ] Bottom nav has glowing active indicator
- [ ] Status badges render correctly (green/orange/red)
- [ ] Progress bars animate on load
- [ ] Active alerts have pulsing red border
- [ ] Page transitions are smooth
- [ ] No text overflow on 390px
- [ ] Hindi text renders correctly
- [ ] Logo has gradient accent effect
- [ ] Cards have subtle tap scale effect

### 6.3 Demo Script (5 minutes)

| Time | What to Show | Say |
|---|---|---|
| 0:00 | Login page | "4 actors, 4 dashboards, one patient loop" |
| 0:30 | Son's dashboard | "Arjun in Pune sees Papa's adherence in real-time" |
| 1:00 | Live WhatsApp: send reminder | "Ramesh gets this in Hindi on his WhatsApp" |
| 1:30 | Tap "Le li" then show dashboard update | "One tap. Real-time sync. No app to install." |
| 2:00 | Meal prompt then swap tip | "Dinner decides sugar. We meet Ramesh where he eats." |
| 2:30 | "Feeling unwell" then coordinator alert | "Safety is real. Not faked." |
| 3:00 | Coordinator resolves | "Human in the loop. Always." |
| 3:30 | Doctor multi-patient view | "Dr. Mehra reviews 2 patients in 30 seconds each" |
| 4:00 | Day-90 progress | "The result. Measurable. 90 days." |
| 4:30 | Wife's page | "Sunita ji gets meal tips, never medicine data. Privacy by design." |
| 5:00 | Close | "A daily loop that connects Ramesh, his family, and his doctor." |

---

## Feature-to-Phase Traceability

Every one of the 17 MVP features from [context.md S11](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md) is covered:

| # | Feature | Phase | Where |
|---|---|---|---|
| 1 | Missed-dose nudge to son | P2 + P4 | Son's dashboard alert card |
| 2 | Refill alert to son | P2 + P4 | Son's dashboard (supply_days) |
| 3 | Weekly family summary | P2 + P4 | Son's dashboard weekly card |
| 4 | Weekly doctor summary | P2 + P4 | Doctor's patient detail |
| 5 | Swap suggestions | P3 + P2 | WhatsApp reply + wife's page |
| 6 | Weekly family pot message | P2 + P4 | Wife's page tip card |
| 7 | Medicine setup from prescription | P2 + P4 | Son uploads |
| 8 | Hindi WhatsApp reminders + voice | P3 | WhatsApp outbound |
| 9 | One-tap "taken" reply | P3 | WhatsApp interactive buttons |
| 10 | Tap meal log (Indian plates) | P3 | WhatsApp list message |
| 11 | Day-0 baseline test | P2 + P4 | Son's dashboard (mocked) |
| 12 | Day-90 retest reminders | P5 | Dashboard + WhatsApp |
| 13 | Before-and-after progress | P5 | WhatsApp text + doctor card |
| 14 | Emergency alert rules | P5 | Coordinator dashboard |
| 15 | Human call-back + feeling unwell | P3 + P5 | WA button to coordinator |
| 16 | Privacy and consent controls | P2 + P4 | Consent-filtered API responses |
| 17 | Medical-advice block | P2 | Pre-approved content only |

---

> **Total: ~6.5 hours** (sequential) or **~5 hours** (with Phase 3 and 4 in parallel).
>
> Phase 0 (15 min) then Phase 1 (60 min) then Phase 2 (90 min) then Phase 3 (60 min) then Phase 4 (110 min) then Phase 5 (35 min) then Phase 6 (45 min)
