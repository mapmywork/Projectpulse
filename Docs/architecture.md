# Project Pulse — System Architecture

> **Version:** 2.2 · **Date:** 8 October 2026
> **Scope:** Hackathon MVP for Ramesh (56, Kanpur, Type 2 diabetes).
> **Build mode:** Hackathon prototype — WhatsApp test mode for Ramesh, **mobile-only web app** for everyone else, Neon Postgres + Upstash Redis, zero infrastructure cost.
> **Source of truth:** [context.md](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md) — Section 11 (feature list), Section 12 (bucket audit)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [System Overview](#2-system-overview)
3. [High-Level Architecture Diagram](#3-high-level-architecture-diagram)
4. [Actor Model](#4-actor-model)
5. [Core Subsystems](#5-core-subsystems)
   - 5.1 WhatsApp Messaging Gateway (Test Mode)
   - 5.2 Medicine Adherence Engine
   - 5.3 Family Loop Service
   - 5.4 Meal Tracker
   - 5.5 Doctor Summary Pipeline
   - 5.6 Lab Coordination Service
   - 5.7 Safety & Emergency System
   - 5.8 Content & Guardrail Service
6. [Feature-to-Subsystem Traceability](#6-feature-to-subsystem-traceability)
7. [Data Architecture](#7-data-architecture)
8. [Privacy & Consent Architecture](#8-privacy--consent-architecture)
9. [Technology Stack & Infrastructure](#9-technology-stack--infrastructure)
10. [WhatsApp Test Mode Setup](#10-whatsapp-test-mode-setup)
11. [API Routes](#11-api-routes)
12. [Web App Pages](#12-web-app-pages)
13. [Architecture Decision Records](#13-architecture-decision-records)
14. [Hackathon Demo Flow](#14-hackathon-demo-flow)
15. [Post-Hackathon Production Path](#15-post-hackathon-production-path)

---

## 1. Design Principles

Every architectural choice is filtered through two lenses: **the context constraints** and **the hackathon time constraint**.

| Principle | Rationale |
|---|---|
| **WhatsApp for Ramesh, Web App for everyone else** | Ramesh (the patient) only uses WhatsApp. The son, wife, doctor, and coordinator interact through a web dashboard — faster to build, easier to demo. |
| **Mobile-only web app (no desktop/tablet)** | The web app is designed exclusively for mobile viewport (390×844 — iPhone 14/15 size). No responsive breakpoints for tablet or desktop. Son, wife, doctor, and coordinator all access it from their phones. Dark theme, card-based layout, bottom navigation bar — inspired by modern mobile-first apps. |
| **WhatsApp Cloud API — Test Mode** | Meta provides a free test phone number instantly. No business verification needed. Up to 5 whitelisted recipient numbers. Zero cost. |
| **Neon + Upstash (free tier cloud databases)** | Neon provides serverless PostgreSQL (free: 0.5 GB storage, 190 compute hours/month). Upstash provides serverless Redis (free: 10,000 commands/day). Real databases, zero cost, no local setup. |
| **Hardcoded "happy path" demo** | Build only the flows that will be demonstrated. Edge cases are documented, not coded. |
| **Hindi voice-note capable** | Ramesh's reminders are in Hindi. Voice notes are pre-recorded `.ogg` files, not live TTS. |
| **Safety logic is real, not faked** | Emergency alerts, the "feeling unwell" button, and the medical-advice block are implemented even in the hackathon — they are non-negotiable. |
| **Zero cost** | WhatsApp test mode, Neon free tier, Upstash free tier, Vite dev server — all free. |

---

## 2. System Overview

Project Pulse is a **hybrid care coordination platform**:

- **Ramesh (patient)** interacts via **real WhatsApp** on his phone. He receives Hindi reminders, taps "Taken" buttons, logs meals, and can report feeling unwell.
- **Son, Wife, Doctor, Coordinator** interact via a **React web app** running locally. They see dashboards with alerts, summaries, and reports.
- **The backend** is a single **Node.js + Express** server that:
  - Sends/receives WhatsApp messages via Meta's Cloud API (test mode)
  - Serves the React web app's API endpoints
  - Stores patient data in **Neon** (serverless PostgreSQL — free tier)
  - Uses **Upstash** (serverless Redis — free tier) for session cache, rate limiting, and reminder scheduling

The system does **not** diagnose, prescribe, or deliver therapy. It:
- **Reminds** (medicine adherence via WhatsApp)
- **Logs** (meals, responses)
- **Nudges** (family members via web dashboard, wife via web dashboard)
- **Alerts** (emergencies to coordinator dashboard)
- **Reports** (weekly summaries on doctor dashboard)
- **Proves** (before-and-after HbA1c comparison at Day 90)

---

## 3. High-Level Architecture Diagram

```mermaid
graph LR
    %% Styling
    classDef actor fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000
    classDef wa fill:#25D366,stroke:#128C7E,stroke-width:2px,color:#fff
    classDef web fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    classDef server fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000
    classDef data fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000

    subgraph "Actors"
        direction TB
        R["👤 Ramesh<br/>(Patient)"]:::actor
        S["👤 Son<br/>(Payer/Helper)"]:::actor
        W["👤 Wife<br/>(Cook)"]:::actor
        D["👨‍⚕️ Doctor"]:::actor
        CC["📞 Coordinator"]:::actor
    end

    subgraph "Channels"
        direction TB
        WA["WhatsApp Cloud API<br/>(Test Mode — Free)"]:::wa
        WEB["React Web App<br/>(Vite — localhost)"]:::web
    end

    subgraph "Backend"
        direction TB
        API["Express Server<br/>(Node.js)"]:::server
        GW["WhatsApp Webhook<br/>Handler"]:::server
    end

    subgraph "Data Layer (Cloud — Free Tier)"
        direction TB
        NEON[("Neon PostgreSQL<br/>(Patient Data)")]:::data
        REDIS["Upstash Redis<br/>(Cache + Queue)"]:::data
    end

    %% Ramesh uses WhatsApp
    R <-->|"Hindi text +<br/>voice + buttons"| WA
    WA <-->|"Webhooks"| GW

    %% Everyone else uses the web app
    S <-->|"Browser"| WEB
    W <-->|"Browser"| WEB
    D <-->|"Browser"| WEB
    CC <-->|"Browser"| WEB

    %% Web app talks to API
    WEB <-->|"REST API"| API

    %% Backend reads/writes state
    GW --> API
    API <--> NEON
    API <--> REDIS
```

**How to read this diagram:**
1. **Left column (Actors):** The five people who interact with the system.
2. **Middle column (Channels):** Ramesh uses WhatsApp (green). Everyone else uses the web app (orange).
3. **Right-top (Backend):** A single Node.js server handles both WhatsApp webhooks and web app API calls.
4. **Right-bottom (Data):** Patient data is stored in **Neon** (serverless PostgreSQL). Session cache, rate limiting, and reminder scheduling use **Upstash** (serverless Redis). Both are free tier, cloud-hosted — no local database setup.

---

## 4. Actor Model

Each actor has a distinct channel and role. The hackathon seeds two patients (Ramesh and Suresh) to demonstrate the doctor's multi-patient view.

| Actor | Channel | Can See | Can Do | Cannot Do |
|---|---|---|---|---|
| **Ramesh** (patient) | WhatsApp (Test Mode) | Hindi reminders, meal options, swap suggestions | Tap "taken", log meals, report "feeling unwell" | Change medicines, see clinical flags |
| **Son** (payer) | Web App | Missed-dose alerts, refill alerts, weekly summary, prescription list | Upload prescription, view Ramesh's adherence (consented data only) | See data Ramesh hasn't shared, change prescriptions |
| **Wife** (food decider) | Web App | Weekly "family pot" meal tips, swap suggestions | Read tips | See medicine data, clinical flags |
| **Doctor** | Web App | Patient list, per-patient weekly summary, flagged events, adherence trends | Select a patient, review flags, mark as "Reviewed" | Prescribe through the platform |
| **Coordinator** | Web App | Emergency alert queue, all patient data | Resolve alerts, log call-backs | Diagnose, prescribe, deliver therapy |

### Consent Model (Simplified for Hackathon)

Ramesh controls what each person sees. For the hackathon, consent defaults are hardcoded:

| Data Type | Son | Wife | Doctor | Coordinator |
|---|---|---|---|---|
| Medicine adherence (%) | ✅ | ❌ | ✅ | ✅ |
| Individual missed doses | ❌ | ❌ | ✅ | ✅ |
| Meal logs | ❌ | ✅ (tips only) | ✅ | ✅ |
| Lab results (HbA1c) | ✅ | ❌ | ✅ | ✅ |
| Emergency events | ✅ | ❌ | ✅ | ✅ |

---

## 5. Core Subsystems

All subsystems run inside the single Express server. They are logical modules, not separate services.

### 5.1 WhatsApp Messaging Gateway (Test Mode)

The bridge between Ramesh's phone and our backend.

> **Hackathon approach:** Uses Meta's free test phone number. Your real phone number is whitelisted as "Ramesh". All messages are sent/received via the WhatsApp Cloud API.

**How it works:**

```
┌────────────────────────────────────────────────┐
│        WhatsApp Gateway (Test Mode)            │
├────────────────────────────────────────────────┤
│                                                │
│  OUTBOUND (Server → Ramesh's WhatsApp):        │
│   1. Medicine reminder with buttons            │
│   2. Meal log prompt with quick replies         │
│   3. Swap suggestion after meal selection       │
│   4. "Feeling unwell" acknowledgment            │
│                                                │
│  INBOUND (Ramesh's WhatsApp → Server):         │
│   1. Button tap: "taken" / "not yet"           │
│   2. Quick reply: meal selection               │
│   3. Button tap: "feeling unwell"              │
│   4. Free text (logged, not parsed by AI)      │
│                                                │
│  Webhook endpoint: POST /webhook               │
│  Verification:     GET  /webhook               │
│                                                │
└────────────────────────────────────────────────┘
```

**Key rules:**
- All outbound messages use **pre-approved templates** (no free-text AI responses)
- Voice notes are **pre-recorded `.ogg` files** in Hindi (not live TTS for hackathon)
- Button-first interaction over free text
- Every inbound message updates the in-memory state and triggers dashboard updates

---

### 5.2 Medicine Adherence Engine

> **Bucket audit:** Features #7–9 are **Showstoppers** (minimum resource). Features #1–2 are **Gamechangers** (full investment). See [context.md §12.1](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).

**Hackathon implementation:**

```
Ramesh's Prescription (hardcoded):
  ├─ Metformin 500mg — Morning (8:00 AM) + Evening (8:00 PM)
  ├─ Glimepiride 1mg — Morning (8:00 AM)
  └─ Supply: 30 days from enrollment

Reminder Flow (triggered manually or by timer):
  1. Server sends WhatsApp message:
     "🕗 Ramesh ji, subah ki dawai ka samay
      Metformin 500mg leni hai
      [✅ Le li]  [⏰ Baad mein]"

  2a. Ramesh taps "Le li"
      → State updated: dose_taken = true
      → Son's dashboard shows ✅

  2b. No response in 60 min (simulated)
      → Son's dashboard shows ⚠️ "Missed dose alert"
      → WhatsApp re-nudge sent to Ramesh

Refill Tracking:
  - Hardcoded: "5 days of supply remaining"
  - Son's dashboard shows refill alert with ⚠️
```

**Guardrails:**
- System never says "skip this medicine" or "take extra"
- "Feeling unwell after this medicine" button logs the event and flags the coordinator — no automated advice

---

### 5.3 Family Loop Service

> **Bucket audit:** Features #1, #2, #3, #6 are **Gamechangers** (full investment). See [context.md §12.1, §12.5](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).
>
> **Cluster risk:** The family loop only works when every piece lands. If the son stops checking the dashboard or Ramesh revokes consent, the cluster falls apart.

**Hackathon implementation:**

| Component | Where it shows | What it shows |
|---|---|---|
| **Missed-dose nudge** | Son's web dashboard (real-time) | "Papa ne subah ki Metformin nahi li. ⚠️" |
| **Refill alert** | Son's web dashboard | "Papa ki Glimepiride 5 din mein khatam hogi. Reorder karein?" |
| **Weekly family summary** | Son's web dashboard | Adherence %, meals logged, flags this week |
| **Family pot message** | Wife's web dashboard | "Ramesh ji ke liye aloo paratha ki jagah moong dal cheela try karein 🥘" |

**Anti-surveillance design (preserved even in hackathon):**
- Son sees percentages, not individual missed doses
- Wife sees only meal tips, never medicine or clinical data
- Consent matrix is displayed on the dashboard

---

### 5.4 Meal Tracker

> **Bucket audit:** Feature #10 (tap meal log) is a **Showstopper**. Features #5–6 (swaps + family pot) are **Gamechangers**. Photo meal logging, after-meal sugar check, and stand-alone walk prompt are **CUT**. See [context.md §12.3](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).

**Hackathon implementation:**

WhatsApp sends Ramesh a meal prompt:

```
"Dopahar ka khana kya khaya?"

[🍚 Chawal + Dal]   [🫓 Roti + Sabzi]
[🥘 Paratha]        [🍛 Biryani/Pulao]
[🥣 Daliya/Oats]    [🍌 Fruit]
```

On selection, a hardcoded swap suggestion is sent back:

```
"👍 Sahi choice! Agar paratha ki jagah
 moong dal cheela banaye to sugar ke
 liye aur accha hoga."
```

**Swap library (hardcoded for hackathon):**

| Ramesh eats | Swap suggestion |
|---|---|
| Aloo Paratha | Moong dal cheela |
| Chawal + Dal | Brown rice + dal, or roti + dal |
| Biryani/Pulao | Jeera rice with raita (small portion) |
| Meetha (sweets) | Gud (jaggery) in small amount or fruit |

---

### 5.5 Doctor Summary Pipeline

> **Bucket audit:** Feature #4 is a **Gamechanger** (full investment). The doctor controls trust. See [context.md §12.5](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).

**Hackathon implementation:**

The Doctor's web dashboard page shows a single summary card:

```
┌─────────────────────────────────────────────────┐
│  WEEKLY SUMMARY — Ramesh Kumar, 56              │
│  Week: 1–7 Oct 2026 · HbA1c baseline: 8.2      │
├─────────────────────────────────────────────────┤
│  💊 Medicine adherence:  18/21 doses (86%)      │
│     Missed: Metformin (eve) × 3                 │
│                                                 │
│  🍽️ Meals logged:  9/14 main meals              │
│     Swaps accepted: 3/9                         │
│                                                 │
│  🚨 Flags this week:                            │
│     • "Feeling unwell" after Glimepiride ×1     │
│                                                 │
│  📊 Trend: adherence stable, meal logging ↑     │
├─────────────────────────────────────────────────┤
│  [✅ Reviewed]  [📞 Call Patient]               │
└─────────────────────────────────────────────────┘
```

**For hackathon:** This data is computed from the in-memory state (how many "taken" taps, how many meal logs, any emergency events). It updates in real time as the demo progresses.

---

### 5.6 Lab Coordination Service

> **Bucket audit:** Features #11–13 are **Showstoppers** (minimum resource). See [context.md §12.2](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).

**Hackathon implementation:**

No real lab API integration. The flow is hardcoded:

1. **Day 0:** Son's dashboard shows "Book baseline HbA1c test" → Son clicks "Book" → Status changes to "Booked"
2. **Baseline result:** Hardcoded as HbA1c = 8.2 (displayed on doctor and son dashboards)
3. **Day 90:** Son's dashboard shows reminder "Retest due" → Son clicks "Book" → Status changes to "Booked"
4. **Day 90 result:** Hardcoded as HbA1c = 7.6 → Progress message sent to Ramesh via WhatsApp:

```
"Badhai ho Ramesh ji! 🎉
 Pehle: 8.2 → Ab: 7.6
 0.6 point kam hua!
 Dawai aur khana dono ka asar dikh raha hai."
```

---

### 5.7 Safety & Emergency System

> **Bucket audit:** Features #14–17 are **Safety** (non-negotiable). Fortnightly mood check is **CUT**. See [context.md §12.4](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md).

**This is implemented for real, even in the hackathon.** Safety is non-negotiable.

**Emergency triggers:**

| Trigger | Detection | Response |
|---|---|---|
| Ramesh taps "Feeling unwell" button on WhatsApp | Inbound button tap | Coordinator dashboard flashes 🔴 alert. WhatsApp ack sent: "Aapki baat sunne ke liye coordinator call karenge." |
| 3+ missed doses in a row | In-memory state counter | Coordinator dashboard shows ⚠️. Doctor dashboard flags it. |
| Distress keywords in free text (e.g. "chakkar", "gir gaya") | Simple keyword match | Coordinator dashboard flashes 🔴 alert. |

**Hard rules (enforced in code):**
- The system **never** tells Ramesh to change medicine dosage
- The system **never** tells Ramesh "you're fine" in response to distress
- Every "feeling unwell" event is logged and cannot be dismissed without a coordinator note

---

### 5.8 Content & Guardrail Service

All outbound health content is from a hardcoded library. No generative AI.

**Content library (for hackathon):**

| Category | # Templates | Examples |
|---|---|---|
| Medicine reminders | 3 | Morning reminder, evening reminder, re-nudge |
| Meal prompts | 2 | Lunch prompt, dinner prompt |
| Swap suggestions | 6 | One per plate type |
| Progress messages | 2 | Day-90 improved, Day-90 not improved |
| Emergency responses | 2 | "Coordinator will call", "Call 108 for emergency" |
| Family pot messages | 3 | Weekly tip for wife |

**Guardrail checks:**
- ❌ BLOCK: diagnosis language
- ❌ BLOCK: prescription changes
- ❌ BLOCK: "cure" / "reverse" claims
- ❌ BLOCK: free-text health advice
- ✅ ALLOW: only content from the pre-approved library above

---

## 6. Feature-to-Subsystem Traceability

Every MVP feature (from [context.md §11](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md)) maps to a subsystem and a channel.

| # | Feature | Channel | Primary Subsystem | Hackathon Status |
|---|---|---|---|---|
| 1 | Missed-dose nudge to the son | Web App | Family Loop Service | ✅ Real-time on dashboard |
| 2 | Refill alert to the son | Web App | Family Loop Service | ✅ Hardcoded "5 days left" |
| 3 | Weekly family summary | Web App | Family Loop Service | ✅ Computed from state |
| 4 | Weekly one-page doctor summary | Web App | Doctor Summary Pipeline | ✅ Live dashboard card |
| 5 | Swap suggestions for foods he eats | WhatsApp | Meal Tracker | ✅ Hardcoded swap library |
| 6 | Weekly "family pot" message to wife | Web App | Family Loop Service | ✅ Displayed on wife's page |
| 7 | Medicine setup from prescription photo | Web App | Medicine Adherence Engine | ✅ Son uploads, hardcoded extraction |
| 8 | Hindi WhatsApp reminders + voice note | WhatsApp | Messaging Gateway | ✅ Template messages + pre-recorded audio |
| 9 | One-tap "taken" reply | WhatsApp | Medicine Adherence Engine | ✅ Interactive buttons |
| 10 | Tap meal log (6–8 Indian plates) | WhatsApp | Meal Tracker | ✅ Quick reply buttons |
| 11 | Day-0 baseline test with home pickup | Web App | Lab Coordination | ✅ Son clicks "Book" (mocked) |
| 12 | Day-90 retest reminders | Web App + WhatsApp | Lab Coordination | ✅ Reminder on dashboard + WhatsApp |
| 13 | Before-and-after progress message | WhatsApp | Lab Coordination | ✅ Hardcoded HbA1c comparison |
| 14 | Emergency alert rules | Web App | Safety & Emergency | ✅ Real keyword detection |
| 15 | Human call-back + "feeling unwell" | WhatsApp + Web App | Safety & Emergency | ✅ Button → coordinator alert |
| 16 | Privacy and consent controls | Web App | Consent Model | ✅ Hardcoded consent matrix |
| 17 | Medical-advice block | All | Content & Guardrail | ✅ Pre-approved templates only |

**Cut features (not built):**

| Feature | Why cut |
|---|---|
| Photo meal logging | Needs food recognition + good internet. Tapping works. |
| After-meal sugar check | Needs a glucometer. Son wouldn't notice it missing. |
| Stand-alone walk prompt | Won't change who buys. |
| Fortnightly mood check | Needs counsellor tie-ups. |
| Automatic prescription reading | OCR on Indian prescriptions is unreliable. |
| Designed progress card | Plain text with 3 numbers is enough. |

---

## 7. Data Architecture

### Database: Neon (Serverless PostgreSQL — Free Tier)

**Why Neon:** Serverless PostgreSQL with a generous free tier (0.5 GB storage, 190 compute hours/month). No local Postgres installation needed. Connect via a connection string in `.env`.

**Schema:**

```sql
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
  patient_id  INT REFERENCES patients(id),
  role        VARCHAR(20) NOT NULL,  -- 'son', 'wife', 'doctor', 'coordinator'
  name        VARCHAR(100),
  phone       VARCHAR(15),
  city        VARCHAR(50),
  access_code VARCHAR(20) NOT NULL   -- e.g. 'SON2026', 'DOC2026'
);

-- Medicines (entered by son)
CREATE TABLE medicines (
  id            SERIAL PRIMARY KEY,
  patient_id    INT REFERENCES patients(id),
  name          VARCHAR(100) NOT NULL,
  dosage        VARCHAR(50),
  frequency     VARCHAR(20),     -- 'once', 'twice', 'thrice'
  times         TEXT[],          -- '{"08:00","20:00"}'
  supply_days   INT DEFAULT 30,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Dose reminders and confirmations
CREATE TABLE doses (
  id              SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patients(id),
  medicine_id     INT REFERENCES medicines(id),
  scheduled_at    TIMESTAMP NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'taken', 'missed'
  confirmed_at    TIMESTAMP,
  escalated_to_son BOOLEAN DEFAULT FALSE
);

-- Meal logs
CREATE TABLE meals (
  id              SERIAL PRIMARY KEY,
  patient_id      INT REFERENCES patients(id),
  meal_type       VARCHAR(20),    -- 'breakfast', 'lunch', 'dinner'
  plate           VARCHAR(50),    -- 'paratha', 'chawal_dal', 'roti_sabzi'
  swap_offered    VARCHAR(100),
  swap_accepted   BOOLEAN DEFAULT FALSE,
  logged_at       TIMESTAMP DEFAULT NOW()
);

-- Emergency events
CREATE TABLE emergencies (
  id                SERIAL PRIMARY KEY,
  patient_id        INT REFERENCES patients(id),
  type              VARCHAR(50),    -- 'feeling_unwell', 'distress_keyword', 'missed_streak'
  context           TEXT,
  severity          VARCHAR(20),    -- 'low', 'medium', 'high', 'critical'
  resolved          BOOLEAN DEFAULT FALSE,
  coordinator_note  TEXT,
  resolved_at       TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- Consent settings
CREATE TABLE consent (
  id          SERIAL PRIMARY KEY,
  patient_id  INT REFERENCES patients(id),
  target_role VARCHAR(20) NOT NULL,  -- 'son', 'wife', 'doctor'
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
  patient_id  INT REFERENCES patients(id),
  actor       VARCHAR(20),
  action      VARCHAR(100),
  detail      TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### Cache & Queue: Upstash (Serverless Redis — Free Tier)

**Why Upstash:** Serverless Redis with free tier (10,000 commands/day, 256 MB). No local Redis needed. REST API or standard Redis client. Perfect for:

| Use Case | Redis Key Pattern | Example |
|---|---|---|
| Session/rate limiting | `session:{phone}` | Track WhatsApp message rate per user |
| Reminder scheduling | `reminder:{patient_id}:{time}` | Schedule next dose reminder |
| Conversation state | `conv:{phone}` | Track what Ramesh was last asked (medicine or meal) |
| Dashboard real-time | `alerts:{patient_id}` | Push new alerts to coordinator dashboard |
| Dose timeout tracker | `timeout:{dose_id}` | TTL key — expires after 60 min → triggers re-nudge |

### Seed Data (for hackathon demo)

```sql
-- Seed Patient 1: Ramesh
INSERT INTO patients (name, age, city, phone_wa, baseline_hba1c)
VALUES ('Ramesh Kumar', 56, 'Kanpur', '+919876543210', 8.2);

-- Seed Patient 2: Suresh (second patient for doctor's multi-patient view)
INSERT INTO patients (name, age, city, phone_wa, baseline_hba1c)
VALUES ('Suresh Gupta', 62, 'Kanpur', '+919876543220', 9.1);

-- Seed contacts for Ramesh
INSERT INTO contacts (patient_id, role, name, phone, city, access_code) VALUES
(1, 'son', 'Arjun', '+919876543211', 'Pune', 'SON2026'),
(1, 'wife', 'Sunita', NULL, 'Kanpur', 'WIFE2026'),
(1, 'doctor', 'Dr. Mehra', NULL, 'Kanpur', 'DOC2026'),
(1, 'coordinator', 'Priya', '+919876543212', 'Kanpur', 'COORD2026');

-- Seed contacts for Suresh (same doctor, different family)
INSERT INTO contacts (patient_id, role, name, phone, city, access_code) VALUES
(2, 'son', 'Vikram', '+919876543221', 'Delhi', 'SON2027'),
(2, 'doctor', 'Dr. Mehra', NULL, 'Kanpur', 'DOC2026');

-- Seed medicines for Ramesh
INSERT INTO medicines (patient_id, name, dosage, frequency, times, supply_days) VALUES
(1, 'Metformin 500mg', '500mg', 'twice', '{"08:00","20:00"}', 25),
(1, 'Glimepiride 1mg', '1mg', 'once', '{"08:00"}', 5);

-- Seed medicines for Suresh
INSERT INTO medicines (patient_id, name, dosage, frequency, times, supply_days) VALUES
(2, 'Metformin 1000mg', '1000mg', 'twice', '{"08:00","20:00"}', 20),
(2, 'Insulin Glargine', '10 units', 'once', '{"22:00"}', 15);

-- Seed consent for Ramesh
INSERT INTO consent (patient_id, target_role, adherence, missed_doses, meals, labs, emergencies) VALUES
(1, 'son', TRUE, FALSE, FALSE, TRUE, TRUE),
(1, 'wife', FALSE, FALSE, TRUE, FALSE, FALSE),
(1, 'doctor', TRUE, TRUE, TRUE, TRUE, TRUE);

-- Seed consent for Suresh
INSERT INTO consent (patient_id, target_role, adherence, missed_doses, meals, labs, emergencies) VALUES
(2, 'son', TRUE, TRUE, FALSE, TRUE, TRUE),
(2, 'doctor', TRUE, TRUE, TRUE, TRUE, TRUE);
```

---

## 8. Privacy & Consent Architecture

Privacy is preserved even in the hackathon prototype.

**Rules (enforced in the API layer):**

1. **Consent is hardcoded but functional.** The API checks `ramesh.consent.son.adherence` before including adherence data in the son's dashboard response.
2. **Wife sees only meal tips.** The wife's API endpoint returns only meal-related content, never medicine or clinical data.
3. **Son sees percentages, not individual missed doses.** The API returns `adherencePercent: 86` to the son, not the list of missed dose timestamps.
4. **Coordinator sees everything.** Required for safety — this is not optional.
5. **Ramesh can toggle sharing.** A WhatsApp command "Band karo" would set `consent.son.adherence = false`. (For hackathon, this is simulated via a button on the web app.)

---

## 9. Technology Stack & Infrastructure

### Hackathon Stack

```
┌──────────────────────────────────────────────────┐
│              Local Machine (Your Laptop)          │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐     ┌──────────────────────┐   │
│  │ Express      │     │ Vite Dev Server      │   │
│  │ Server       │     │ (React App)          │   │
│  │ Port 3000    │     │ Port 5173            │   │
│  │              │     │                      │   │
│  │ • API routes │     │ • Son Dashboard      │   │
│  │ • WA webhook │     │ • Doctor Dashboard   │   │
│  │ • DB queries │     │ • Wife Page          │   │
│  │              │     │ • Coordinator Page   │   │
│  └──────┬───────┘     └──────────────────────┘   │
│         │                                        │
│         ▼                                        │
│  ┌──────────────┐                                │
│  │ ngrok tunnel │  (exposes localhost:3000        │
│  │              │   to the internet for           │
│  │              │   WhatsApp webhooks)            │
│  └──────┬───────┘                                │
│         │                                        │
└─────────│────────────────────────────────────────┘
          │
          ├──────────────────────┐
          ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Meta WhatsApp       │  │  Neon PostgreSQL     │
│  Cloud API           │  │  (Serverless — Free) │
│  (Test Mode — Free)  │  ├──────────────────────┤
└──────────────────────┘  │  Upstash Redis       │
          │               │  (Serverless — Free) │
          ▼               └──────────────────────┘
┌──────────────────────┐
│  📱 Your Phone       │
│  (Acting as Ramesh)  │
└──────────────────────┘
```

### Technology Choices

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | Vite + React | Fastest setup, hot reload, zero config |
| **Viewport** | Mobile-only (390×844) | No desktop or tablet breakpoints. Fixed mobile layout. `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` |
| **Styling** | Vanilla CSS (dark theme) | No Tailwind dependency. Dark background (#0a0a0f), card-based layout, bottom navigation bar, glassmorphism effects, vibrant accent gradients. No responsive breakpoints. |
| **Backend** | Node.js + Express | Single file possible, handles both API + webhooks |
| **Database** | Neon (serverless PostgreSQL) | Free tier: 0.5 GB, 190 compute hours/month. No local install. Connect via URL. |
| **Cache/Queue** | Upstash (serverless Redis) | Free tier: 10,000 commands/day. Session state, reminder scheduling, rate limiting. |
| **ORM** | Drizzle ORM or raw `pg` client | Lightweight, TypeScript-friendly, fast queries |
| **WhatsApp** | Meta Cloud API (Test Mode) | Free, instant, no business verification |
| **Tunnel** | ngrok | Exposes localhost to internet for WhatsApp webhooks |
| **Voice Notes** | Pre-recorded `.ogg` files | No TTS API cost, works offline |

### Cost Estimate

| Item | Cost |
|---|---|
| WhatsApp Cloud API (Test Mode) | ₹0 |
| Neon PostgreSQL (free tier) | ₹0 (0.5 GB storage, 190 compute hrs) |
| Upstash Redis (free tier) | ₹0 (10,000 commands/day) |
| Vite dev server | ₹0 (runs locally) |
| Express server | ₹0 (runs locally) |
| ngrok (free tier) | ₹0 |
| **Total** | **₹0** |

---

## 10. WhatsApp Test Mode Setup

### Step-by-step (takes ~10 minutes)

1. **Create Meta Developer App:**
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Create a new app → Select "Business" type
   - Add the "WhatsApp" product

2. **Get Test Credentials (provided instantly by Meta):**
   - Test Phone Number ID (Meta gives you one)
   - Temporary Access Token (valid 24 hours — sufficient for hackathon)
   - API Version (v18.0 or later)

3. **Whitelist Recipient Numbers:**
   - Add your phone number (you'll pretend to be Ramesh)
   - Add a teammate's number (to test the son's WhatsApp nudge, if needed)
   - Up to 5 numbers total

4. **Set Up Webhook:**
   - Start ngrok: `ngrok http 3000`
   - Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - In Meta dashboard → WhatsApp → Configuration → Webhook URL: `https://abc123.ngrok.io/webhook`
   - Set Verify Token to match your `.env` file
   - Subscribe to: `messages`

5. **Environment Variables (`.env` file):**

```env
# WhatsApp Cloud API (Test Mode)
WHATSAPP_TOKEN=your_temporary_access_token
WHATSAPP_PHONE_NUMBER_ID=your_test_phone_number_id
WEBHOOK_VERIFY_TOKEN=your_chosen_secret_string
RAMESH_PHONE=919876543210

# Neon PostgreSQL (free tier — get from neon.tech dashboard)
DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/projectpulse?sslmode=require

# Upstash Redis (free tier — get from console.upstash.com)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

PORT=3000
```

---

## 11. API Routes

### Backend API Design

```
Express Server (port 3000)
│
├── WhatsApp Webhook
│   ├── GET  /webhook          → Verification (Meta handshake)
│   └── POST /webhook          → Receive inbound messages from Ramesh
│
├── WhatsApp Actions (internal triggers)
│   ├── POST /api/send-reminder        → Send medicine reminder to Ramesh
│   ├── POST /api/send-meal-prompt     → Send meal log prompt to Ramesh
│   └── POST /api/send-progress       → Send Day-90 progress message
│
├── Son's Dashboard API
│   ├── GET  /api/son/dashboard        → Missed alerts, refill, weekly summary
│   ├── POST /api/son/upload-prescription → Upload prescription image
│   └── POST /api/son/book-lab         → Book lab test (mocked)
│
├── Doctor's Dashboard API
│   ├── GET  /api/doctor/patients       → List all patients for this doctor
│   ├── GET  /api/doctor/summary/:id    → Weekly summary for a specific patient
│   └── POST /api/doctor/review/:id     → Mark a patient's summary as reviewed
│
├── Wife's Page API
│   └── GET  /api/wife/tips            → Weekly family pot message
│
├── Coordinator API
│   ├── GET  /api/coordinator/alerts   → Emergency alert queue
│   └── POST /api/coordinator/resolve  → Resolve an alert with a note
│
└── Patient State API
    ├── GET  /api/patient/state        → Full Ramesh state (debug)
    └── GET  /api/patient/consent      → Consent matrix
```

---

## 12. Web App Pages — Login & Dashboards

> **Design language:** Mobile-only (390×844). Dark theme (#0a0a0f background). Card-based UI with glassmorphism. Bottom navigation bar. Vibrant accent gradients (purple/orange). No desktop or tablet layouts. All wireframes below represent mobile screens.

### Authentication (Simplified for Hackathon)

Each actor has a **separate login** and lands on a **unique dashboard**. For the hackathon, authentication is simplified — no passwords, just role selection with a hardcoded access code.

```mermaid
graph TD
    classDef login fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000
    classDef dash fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000

    LP["🏠 Login Page<br/>(localhost:5173)"]:::login

    LP -->|"Code: SON2026"| SD["👤 Son's Dashboard<br/>/son"]:::dash
    LP -->|"Code: DOC2026"| DD["👨‍⚕️ Doctor's Dashboard<br/>/doctor"]:::dash
    LP -->|"Code: WIFE2026"| WD["👤 Wife's Page<br/>/wife"]:::dash
    LP -->|"Code: COORD2026"| CD["📞 Coordinator Dashboard<br/>/coordinator"]:::dash
```

**Login Page (`/`) — Mobile Screen:**
- Dark background with Project Pulse logo + tagline: *"Keeping Ramesh ji's sugar in check — together."*
- Four role cards in a vertical scrollable list: Son, Doctor, Wife, Coordinator
- Each card has an icon, role name, and a tap to enter access code
- On valid code → redirect to the role's dashboard
- On invalid code → "Access denied" toast
- No desktop layout. Viewport locked to mobile.

**Post-hackathon:** Replace with JWT + phone OTP authentication. Each user registered with a role in the database.

### UI Design System (Mobile-Only)

| Property | Value |
|---|---|
| **Viewport** | 390×844 (iPhone 14/15). No tablet/desktop breakpoints. |
| **Background** | `#0a0a0f` (near-black) |
| **Cards** | `rgba(255,255,255,0.05)` with `backdrop-filter: blur(10px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: 16px` |
| **Accent gradient** | `linear-gradient(135deg, #7c3aed, #f97316)` (purple → orange) |
| **Text** | Primary: `#f5f5f5`. Secondary: `rgba(255,255,255,0.6)` |
| **Bottom nav** | Fixed bar with 4 icons: Home, Alerts, Reports, Profile. Glowing active indicator. |
| **Font** | Inter (Google Fonts) |
| **Spacing** | 16px horizontal padding. 12px card gap. |
| **Status badges** | Green pill (`#22c55e`), Orange pill (`#f97316`), Red pill (`#ef4444`) |
| **Animations** | Subtle card hover/tap scale (1.02). Smooth page transitions. |

---

### 12.1 Son's Dashboard (`/son`) — Mobile Screen

The son (Arjun, Pune) is the **payer and setup person**. His dashboard is the most feature-rich. All cards stack vertically in a scrollable mobile view with a bottom navigation bar.

```
┌──────────────────────────────────────────────────────────┐
│  🏠 Project Pulse — Son's Dashboard                     │
│  Welcome, Arjun · Papa: Ramesh Kumar, Kanpur            │
├──────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │ 💊 TODAY'S MEDICINES │  │ ⚠️ ALERTS                │  │
│  │                     │  │                          │  │
│  │ Metformin (AM) ✅   │  │ 🔴 "Feeling unwell"     │  │
│  │ Glimepiride (AM) ✅ │  │    after Glimepiride     │  │
│  │ Metformin (PM) ⏳   │  │    Oct 5, 9:30 AM        │  │
│  │   Waiting...        │  │                          │  │
│  │                     │  │ 🟡 Refill needed         │  │
│  │ Adherence: 86%      │  │    Glimepiride: 5 days   │  │
│  └─────────────────────┘  └──────────────────────────┘  │
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │ 📋 PRESCRIPTION     │  │ 📊 WEEKLY SUMMARY        │  │
│  │                     │  │                          │  │
│  │ [📷 Upload Photo]   │  │ Doses taken: 18/21 (86%)│  │
│  │                     │  │ Meals logged: 9/14       │  │
│  │ Current medicines:  │  │ Swaps accepted: 3        │  │
│  │ • Metformin 500mg   │  │ Flags: 1 (unwell)       │  │
│  │   2x daily          │  │                          │  │
│  │ • Glimepiride 1mg   │  │ Papa is doing well! 💪   │  │
│  │   1x daily          │  └──────────────────────────┘  │
│  └─────────────────────┘                                │
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │ 🧪 LAB TESTS        │  │ 🔒 PRIVACY CONTROLS      │  │
│  │                     │  │                          │  │
│  │ Baseline HbA1c: 8.2 │  │ Papa has agreed to share:│  │
│  │ Date: 1 Oct 2026    │  │                          │  │
│  │                     │  │ ✅ Adherence (%)         │  │
│  │ Day-90 retest:      │  │ ❌ Individual misses     │  │
│  │ [📅 Book Retest]    │  │ ❌ Meal logs             │  │
│  │                     │  │ ✅ Lab results           │  │
│  │ Status: Not booked  │  │ ✅ Emergency flags       │  │
│  └─────────────────────┘  └──────────────────────────┘  │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

**Son's dashboard features (mapping to MVP features):**

| Card | MVP Feature # | Real-time? |
|---|---|---|
| Today's Medicines | #9 (one-tap taken) | ✅ Yes — updates when Ramesh taps "Le li" on WhatsApp |
| Alerts (missed dose) | #1 (missed-dose nudge) | ✅ Yes — appears after dose timeout |
| Alerts (refill) | #2 (refill alert) | Static — hardcoded "5 days left" |
| Prescription upload | #7 (medicine setup) | Action — son uploads, system shows list |
| Weekly summary | #3 (weekly family summary) | Computed from in-memory state |
| Lab tests | #11, #12 (baseline + retest) | Action — son clicks "Book" |
| Privacy controls | #16 (consent controls) | Display — shows what Papa shared |

---

### 12.2 Doctor's Dashboard (`/doctor`) — Mobile Screen

The doctor (Dr. Mehra) sees **all their patients in a scrollable list**, and taps any patient to see their weekly summary. On mobile, the patient list is the landing view; tapping a patient navigates to their detail screen (not a sidebar split). Designed for a doctor with 10–50 patients on Project Pulse.

**Mobile flow:** Patient List (home) → Tap patient → Patient Detail → Back to list

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│  👨‍⚕️ Dr. Mehra                │      │  ← Back                     │
│  2 active patients          │      │                              │
├─────────────────────────────┤      │  Ramesh Kumar, 56            │
│                             │      │  Kanpur · HbA1c: 8.2        │
│  ┌─────────────────────────┐│      ├─────────────────────────────┤
│  │ Ramesh K. · 56, Kanpur  ││      │                              │
│  │ ⚠️ 1 flag · Adh: 86%    ││ tap  │  💊 Adherence    ████░░ 86% │
│  │ HbA1c: 8.2              ││ ───→ │  Missed: Metformin (eve) ×3 │
│  └─────────────────────────┘│      │                              │
│                             │      │  🍽️ Meals        █████░ 64%  │
│  ┌─────────────────────────┐│      │  9/14 · Swaps: 3             │
│  │ Suresh G. · 62, Kanpur  ││      │                              │
│  │ 🟢 No flags · Adh: 92%  ││      │  🚨 FLAGS                    │
│  │ HbA1c: 9.1              ││      │  ⚠️ Unwell after Glimepiride│
│  └─────────────────────────┘│      │                              │
│                             │      │  [✅ Reviewed] [📞 Call]     │
├─────────────────────────────┤      ├─────────────────────────────┤
│  🏠    ⚠️    📊    👤       │      │  🏠    ⚠️    📊    👤       │
└─────────────────────────────┘      └─────────────────────────────┘
   PATIENT LIST (home)                  PATIENT DETAIL (Ramesh)
```

```
┌──────────────────────────────────────────────────────────────────────────┐
│  👨‍⚕️ Project Pulse — Doctor's Dashboard                                  │
│  Dr. Mehra · 2 active patients                                          │
├──────────────────┬───────────────────────────────────────────────────────┤
│                  │                                                       │
│  📋 MY PATIENTS  │  📋 WEEKLY SUMMARY — Ramesh Kumar                     │
│                  │  Week of 1–7 Oct 2026 · HbA1c baseline: 8.2          │
│  ┌────────────┐  │                                                       │
│  │ Ramesh K.  │◀─│  💊 Adherence          ████████░░  86%                │
│  │ 56, Kanpur │  │     Missed: Metformin (eve) × 3                      │
│  │ ⚠️ 1 flag  │  │                                                       │
│  │ Adh: 86%   │  │  🍽️ Meals Logged       █████░░░░░  64%                │
│  └────────────┘  │     9 of 14 · Swaps accepted: 3                      │
│                  │                                                       │
│  ┌────────────┐  │  🚨 FLAGS THIS WEEK                                   │
│  │ Suresh G.  │  │     ⚠️ "Feeling unwell" after Glimepiride × 1         │
│  │ 62, Kanpur │  │        (5 Oct, 9:30 AM — coordinator called)          │
│  │ 🟢 No flags│  │                                                       │
│  │ Adh: 92%   │  │  📊 Trend: Adherence stable. Meal logging ↑           │
│  └────────────┘  │                                                       │
│                  │  ┌──────────────┐  ┌──────────────────┐               │
│                  │  │ 🧪 LAB HISTORY│  │ 💊 PRESCRIPTION   │               │
│                  │  │              │  │                  │               │
│                  │  │ Baseline:    │  │ • Metformin 500mg│               │
│                  │  │ HbA1c = 8.2  │  │   2x daily       │               │
│                  │  │              │  │                  │               │
│                  │  │ Day-90:      │  │ • Glimepiride 1mg│               │
│                  │  │ HbA1c = 7.6↓ │  │   1x daily       │               │
│                  │  └──────────────┘  └──────────────────┘               │
│                  │                                                       │
│                  │  [✅ Reviewed]  [📞 Call Patient]  [📝 Add Note]      │
│                  │                                                       │
└──────────────────┴───────────────────────────────────────────────────────┘
```

**Doctor's dashboard features:**

| Card | MVP Feature # | Notes |
|---|---|---|
| Patient list (sidebar) | — | Lists all patients with quick-glance adherence % and flag count. Click to view details. |
| Weekly summary | #4 (doctor summary) | The **gamechanger** — designed to be reviewed in 30 seconds per patient |
| Flags | #14 (emergency rules) | Highlighted if unresolved. Patients with flags sort to the top. |
| Lab history | #11, #13 (baseline + progress) | Before-and-after comparison |
| Prescription | #7 (medicine setup) | Read-only view of what son uploaded |
| Action buttons | — | "Reviewed" marks the summary as seen. "Call Patient" logs intent. |

---

### 12.3 Wife's Page (`/wife`) — Mobile Screen

The wife (Sunita) gets the **simplest view** — a single scrollable mobile screen. She is not a paying customer and didn't ask to join. The page must be friendly, non-blaming, and useful.

```
┌──────────────────────────────────────────────────────────┐
│  🍽️ Project Pulse — Sunita ji ke liye                    │
│  Ramesh ji ka khaana saathi                              │
├──────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🥘 IS HAFTE KI FAMILY POT TIP                      │  │
│  │                                                    │  │
│  │ "Sunita ji, agar aloo paratha bana rahi hain       │  │
│  │  to Ramesh ji ke liye ek-do moong dal cheela       │  │
│  │  bhi bana dein. Sugar ke liye accha hota hai.      │  │
│  │  Puri family ke liye healthy hai! 🥘"               │  │
│  │                                                    │  │
│  │ 💡 Why this works: Moong dal cheela has more       │  │
│  │    protein and less starch than aloo paratha.      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔄 SWAP SUGGESTIONS                                │  │
│  │                                                    │  │
│  │  Instead of:        Try:                           │  │
│  │  🥘 Aloo Paratha  → Moong Dal Cheela              │  │
│  │  🍚 White Chawal  → Brown Rice / Daliya           │  │
│  │  🍛 Biryani       → Jeera Rice + Raita (small)    │  │
│  │  🍰 Meetha        → Gud (small) or Fresh Fruit    │  │
│  │                                                    │  │
│  │  ✅ Doctor-approved · Safe for the whole family    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  🔒 Note: Yeh page sirf khaane ke tips dikhata hai.     │
│     Dawai ya test ki koi jaankari nahi dikhti.           │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

**Wife's page features:**

| Card | MVP Feature # | Notes |
|---|---|---|
| Family pot tip | #6 (weekly family pot message) | Friendly, Hindi, non-blaming |
| Swap suggestions | #5 (swap suggestions) | Doctor-approved, for the whole family |
| Privacy notice | #16 (consent controls) | Explicitly states no medicine/clinical data is shown |

**What she does NOT see:** Medicine names, adherence %, missed doses, lab results, emergency events.

---

### 12.4 Coordinator Dashboard (`/coordinator`) — Mobile Screen

The coordinator manages **safety**. Their dashboard is a scrollable alert queue on a mobile screen.

```
┌──────────────────────────────────────────────────────────┐
│  📞 Project Pulse — Coordinator Dashboard                │
│  Active Alerts: 1 · Resolved Today: 2                   │
├──────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔴 ACTIVE ALERT                                    │  │
│  │                                                    │  │
│  │ Patient: Ramesh Kumar, 56, Kanpur                  │  │
│  │ Type: "Feeling unwell" button tap                  │  │
│  │ Context: After taking Glimepiride 1mg              │  │
│  │ Time: 5 Oct 2026, 9:30 AM                          │  │
│  │ Severity: 🟠 MEDIUM                                │  │
│  │                                                    │  │
│  │ Action required: Call Ramesh within 15 minutes      │  │
│  │ Phone: +91-XXXXXXXXXX                              │  │
│  │                                                    │  │
│  │ [📞 Mark as Called]  [📝 Add Note]  [⬆️ Escalate]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ✅ RESOLVED ALERTS                                  │  │
│  │                                                    │  │
│  │ • 3 Oct — Missed 3 doses in a row (🟡 LOW)        │  │
│  │   Note: "Called son. Papa was travelling."          │  │
│  │   Resolved by: Coordinator at 4:15 PM              │  │
│  │                                                    │  │
│  │ • 1 Oct — Distress keyword "chakkar" (🟠 MEDIUM)  │  │
│  │   Note: "Called Ramesh. Was just dizzy from heat."  │  │
│  │   Resolved by: Coordinator at 11:00 AM             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 📊 PATIENT OVERVIEW (full access)                   │  │
│  │                                                    │  │
│  │ Adherence: 86% · Meals: 9/14 · Labs: 8.2 baseline │  │
│  │ Consent status: Son ✅ · Wife ✅ · Doctor ✅        │  │
│  │ Days since enrollment: 7                           │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
└──────────────────────────────────────────────────────────┘
```

**Coordinator dashboard features:**

| Card | MVP Feature # | Notes |
|---|---|---|
| Active alerts | #14, #15 (emergency rules + human call-back) | Real-time, pulsing red animation |
| Resolved alerts | #15 (human call-back) | Audit trail with notes |
| Patient overview | All | Coordinator sees everything (required for safety) |

---

## 13. Architecture Decision Records

### ADR-01: WhatsApp for Ramesh, Web App for everyone else

| Field | Detail |
|---|---|
| **Decision** | Ramesh interacts only via WhatsApp (test mode). Son, wife, doctor, coordinator use a React web app. |
| **Context** | Ramesh is comfortable only with WhatsApp. The son, wife, and doctor need richer views (tables, charts, upload) that WhatsApp can't provide. For a hackathon, building a web app is faster than building multiple WhatsApp flows. |
| **Consequences** | ✅ Proves the WhatsApp-first concept for the patient. ✅ Rich dashboards for family/doctor. ✅ Faster to build. ❌ Wife and son don't get WhatsApp notifications (post-hackathon improvement). |

### ADR-02: Neon + Upstash (free-tier cloud databases)

| Field | Detail |
|---|---|
| **Decision** | Use Neon (serverless PostgreSQL) for patient data and Upstash (serverless Redis) for cache/queue. Both on free tier. |
| **Context** | Neon and Upstash require zero local installation — just a connection string in `.env`. Free tiers are generous enough for the hackathon and early pilot. Data persists across server restarts. Schema is production-ready from Day 1. |
| **Consequences** | ✅ Real database from the start — no migration headache later. ✅ Data persists. ✅ SQL queries for dashboards. ✅ Redis for real-time features (timeouts, scheduling). ❌ Requires internet connection to reach cloud databases. |
| **Free tier limits:** | Neon: 0.5 GB storage, 190 compute hours/month. Upstash: 10,000 commands/day, 256 MB. More than enough for a single-patient hackathon. |

### ADR-03: Pre-approved content only (no generative AI)

| Field | Detail |
|---|---|
| **Decision** | All health-related messages are from a hardcoded content library. No LLM, no ChatGPT, no free-text AI responses. |
| **Context** | Regulatory constraint: no diagnosis or prescription by software. The misinformation trap is a real risk. Pre-approved templates are safer, faster, and more auditable. |
| **Consequences** | ✅ Zero risk of hallucinated medical advice. ✅ Auditable. ✅ No AI API costs. ❌ Less personalised. |

### ADR-04: ngrok for WhatsApp webhooks

| Field | Detail |
|---|---|
| **Decision** | Use ngrok to expose the local Express server to the internet for WhatsApp webhook delivery. |
| **Context** | WhatsApp Cloud API requires a publicly accessible HTTPS URL for webhooks. ngrok provides this instantly for free during development/hackathon. |
| **Consequences** | ✅ Works in 30 seconds. ✅ Free. ❌ URL changes on restart (re-paste in Meta dashboard). ❌ Not suitable for production. |

### ADR-05: Six features cut from MVP

| Field | Detail |
|---|---|
| **Decision** | Cut photo meal logging, after-meal sugar check, stand-alone walk prompt, fortnightly mood check, automatic prescription reading, and designed progress card. |
| **Context** | Bucket audit (context.md §12) classified these as Distractions. Each adds cost, complexity, or partner dependencies without changing who buys. |
| **Consequences** | ✅ Frees up time for gamechangers (family loop, doctor summary). ❌ MVP is body-first — mood covered only by emergency distress path. |

### ADR-06: Separate login per actor, no shared dashboard

| Field | Detail |
|---|---|
| **Decision** | Each actor (son, doctor, wife, coordinator) has a separate login code and lands on a completely different dashboard. There is no shared "home" page. |
| **Context** | Each actor has a different job and sees different data. The son cares about missed doses. The doctor cares about clinical trends. The wife cares about meals. The coordinator cares about emergencies. Mixing these views would confuse the demo and dilute the value proposition. |
| **Consequences** | ✅ Each dashboard is laser-focused on its actor's needs. ✅ Privacy is enforced by design (wife's page literally doesn't have medicine data). ❌ Four separate pages to build and style. |

---

## 14. Actor Happy Flows (End-to-End)

Each actor's complete journey through the system, from first touch to Day 90.

---

### 14.1 Ramesh's Happy Flow (Patient — WhatsApp)

Ramesh never opens a web app. Everything happens on his WhatsApp.

```mermaid
graph TD
    classDef wa fill:#25D366,stroke:#128C7E,stroke-width:2px,color:#fff

    A["Day 0: Son enrolls Ramesh<br/>Ramesh receives welcome message"]:::wa
    B["Daily: Morning medicine reminder<br/>'🕗 Ramesh ji, subah ki dawai ka samay'<br/>[✅ Le li] [⏰ Baad mein]"]:::wa
    C["Ramesh taps '✅ Le li'<br/>System logs: dose taken"]:::wa
    D["Lunch time: Meal prompt<br/>'Dopahar ka khana kya khaya?'<br/>[🍚 Chawal] [🥘 Paratha] [🫓 Roti]"]:::wa
    E["Ramesh taps '🥘 Paratha'<br/>System replies with swap tip"]:::wa
    F["Evening: Second medicine reminder"]:::wa
    G["Week 3: Ramesh feels unwell<br/>Taps '😟 Tabiyat theek nahi'<br/>System: 'Coordinator call karenge'"]:::wa
    H["Day 90: Progress message<br/>'🎉 Badhai ho! HbA1c 8.2 → 7.6<br/>0.6 point kam hua!'"]:::wa

    A --> B --> C --> D --> E --> F
    F -->|"Repeats daily<br/>for 90 days"| B
    F --> G
    G -->|"Coordinator calls back"| F
    F --> H
```

**Step-by-step:**

| Step | Day | What happens on Ramesh's WhatsApp | System action |
|---|---|---|---|
| 1 | Day 0 | Receives: "Namaste Ramesh ji! Aapke bete Arjun ne aapko Project Pulse mein enroll kiya hai. Hum aapki dawai aur khaane ka dhyan rakhenge. 🙏" | Log enrollment |
| 2 | Day 1, 8:00 AM | Receives: "🕗 Ramesh ji, subah ki dawai ka samay. Metformin 500mg leni hai. [✅ Le li] [⏰ Baad mein]" | Reminder sent |
| 3 | Day 1, 8:12 AM | Taps `[✅ Le li]` | Dose logged as taken. Son's dashboard updated ✅ |
| 4 | Day 1, 8:00 PM | Receives evening reminder for Metformin | Reminder sent |
| 5 | Day 1, 8:00 PM | Does NOT tap anything | After 60 min: re-nudge sent. After 120 min: son alerted ⚠️ |
| 6 | Day 2, 1:00 PM | Receives: "Dopahar ka khana kya khaya? [🍚 Chawal+Dal] [🥘 Paratha] [🫓 Roti+Sabzi] ..." | Meal prompt sent |
| 7 | Day 2, 1:05 PM | Taps `[🥘 Paratha]` | Meal logged. Reply: "Agar paratha ki jagah moong dal cheela banaye to sugar ke liye accha hoga 👍" |
| 8 | Week 3 | Taps `[😟 Tabiyat theek nahi]` | Emergency event created. Coordinator dashboard flashes 🔴. WhatsApp reply: "Aapki baat sunne ke liye coordinator 15 min mein call karenge." |
| 9 | Day 75 | Receives: "Ramesh ji, 15 din mein HbA1c retest hai. Arjun se baat kar lein." | Retest reminder |
| 10 | Day 90 | Receives: "🎉 Badhai ho Ramesh ji! Pehle: 8.2 → Ab: 7.6. 0.6 point kam hua! Dawai aur khana dono ka asar dikh raha hai." | Progress message |

---

### 14.2 Son's Happy Flow (Payer/Helper — Web App)

The son (Arjun) sets everything up and monitors Papa remotely from Pune.

```mermaid
graph TD
    classDef web fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000

    A["Login: enters code SON2026<br/>→ Redirected to /son"]:::web
    B["Day 0: Uploads prescription photo<br/>System shows: Metformin 500mg, Glimepiride 1mg"]:::web
    C["Day 0: Clicks 'Book Baseline Test'<br/>Status: Booked ✅"]:::web
    D["Day 0: Reviews consent matrix<br/>Confirms what Papa agreed to share"]:::web
    E["Day 1: Dashboard shows<br/>Metformin AM ✅ · Glimepiride AM ✅"]:::web
    F["Day 1 evening: Alert appears<br/>'⚠️ Papa ne shaam ki Metformin nahi li'"]:::web
    G["Week 2: Refill alert appears<br/>'Glimepiride 5 din mein khatam hogi'"]:::web
    H["Weekly: Summary card updates<br/>Adherence 86% · Meals 9/14 · Flags 1"]:::web
    I["Day 90: Before-and-after card appears<br/>'HbA1c: 8.2 → 7.6 ↓ 🎉'"]:::web

    A --> B --> C --> D --> E --> F --> G --> H --> I
```

**Step-by-step:**

| Step | Day | What Son sees on the Web App | Son's action |
|---|---|---|---|
| 1 | Day 0 | Login page → enters `SON2026` | Redirected to `/son` dashboard |
| 2 | Day 0 | Empty prescription card: "Upload Papa's prescription" | Clicks upload → selects photo → system shows extracted medicine list |
| 3 | Day 0 | Lab test card: "Book baseline HbA1c test" | Clicks "Book" → status changes to "Booked ✅" |
| 4 | Day 0 | Privacy card: "Papa has agreed to share: Adherence ✅, Individual misses ❌, Labs ✅" | Reviews and confirms |
| 5 | Day 1 | Today's Medicines card: "Metformin AM ✅ · Glimepiride AM ✅" (updates in real-time as Ramesh taps buttons) | Watches with peace of mind |
| 6 | Day 1 PM | Alert card flashes: "⚠️ Papa ne shaam ki Metformin nahi li" | Calls Papa to remind him |
| 7 | Week 2 | Refill alert: "Glimepiride — 5 days of supply left. Reorder?" | Orders from pharmacy (or marks "Already bought") |
| 8 | Weekly | Summary card: Adherence 86%, Meals logged 9/14, Swaps accepted 3, Flags: 1 | Glances weekly for peace of mind |
| 9 | Day 75 | Lab card: "Day-90 retest due. Book now?" | Clicks "Book Retest" |
| 10 | Day 90 | Progress card: "Papa's HbA1c: 8.2 → 7.6. Drop: 0.6 points 🎉" | Shares with family, considers renewing subscription |

---

### 14.3 Wife's Happy Flow (Food Decider — Web App)

Sunita's flow is the simplest. She visits once a week (or whenever the son tells her there's a new tip).

```mermaid
graph TD
    classDef web fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000

    A["Login: enters code WIFE2026<br/>→ Redirected to /wife"]:::web
    B["Sees this week's 'Family Pot' tip<br/>'Moong dal cheela try karein...'"]:::web
    C["Scrolls to swap table<br/>Paratha → Cheela, Chawal → Daliya..."]:::web
    D["Notices privacy footer<br/>'Sirf khaane ke tips — dawai nahi'"]:::web
    E["Cooks moong dal cheela this week<br/>(action happens offline, in the kitchen)"]:::web

    A --> B --> C --> D --> E
```

**Step-by-step:**

| Step | When | What Wife sees on the Web App | Her action |
|---|---|---|---|
| 1 | Week 1 | Login page → enters `WIFE2026` → redirected to `/wife` | Lands on a clean, Hindi-first page |
| 2 | Week 1 | Family pot tip card: "Sunita ji, agar aloo paratha bana rahi hain to Ramesh ji ke liye moong dal cheela bhi bana dein. Sugar ke liye accha hota hai. 🥘" | Reads the tip |
| 3 | Week 1 | Swap table: Paratha → Cheela, Chawal → Brown Rice, Biryani → Jeera Rice | Sees alternatives |
| 4 | Week 1 | Footer: "Yeh page sirf khaane ke tips dikhata hai. Dawai ya test ki koi jaankari nahi dikhti." | Trusts that her page is limited and respectful |
| 5 | Offline | Makes moong dal cheela for dinner | The loop closes — Ramesh eats healthier without being lectured |
| 6 | Week 2 | New tip appears: "Is hafte try karein: daliya upma. Ramesh ji ne kal chawal khaye the, daliya swap accept kiya! 💪" | Sees that the tips adapt to Ramesh's meal logs |

**What she NEVER sees:** Medicine names, adherence %, missed doses, lab results, emergency events, coordinator notes.

---

### 14.4 Doctor's Happy Flow (Trust Influencer — Web App)

Dr. Mehra sees all their patients in a list, reviews each one quickly, and focuses on flagged patients. The entire weekly review should take under 5 minutes for 10 patients.

```mermaid
graph TD
    classDef web fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000

    A["Login: enters code DOC2026<br/>→ Redirected to /doctor"]:::web
    B["Sees patient list sidebar:<br/>Ramesh K. ⚠️ 1 flag · 86%<br/>Suresh G. 🟢 · 92%"]:::web
    C["Clicks 'Ramesh K.'<br/>Summary loads on the right"]:::web
    D["Reviews flag:<br/>'Feeling unwell after Glimepiride'"]:::web
    E["Clicks '✅ Reviewed'"]:::web
    F["Clicks 'Suresh G.' in sidebar<br/>Quick scan: all good, no flags"]:::web
    G["Clicks '✅ Reviewed' for Suresh"]:::web
    H["Day 90: Ramesh's card shows<br/>HbA1c 8.2 → 7.6 ↓ 🎉"]:::web
    I["Doctor trusts the system<br/>Recommends to next patient"]:::web

    A --> B --> C --> D --> E --> F --> G --> H --> I
```

**Step-by-step:**

| Step | When | What Doctor sees on the Web App | Doctor's action |
|---|---|---|---|
| 1 | Week 1 | Login page → enters `DOC2026` → redirected to `/doctor` | Lands on the multi-patient dashboard |
| 2 | Week 1 | **Patient sidebar** shows 2 patients: "Ramesh K. (⚠️ 1 flag, 86%)" and "Suresh G. (🟢 no flags, 92%)". Flagged patients are sorted to the top. | Scans the list — sees Ramesh needs attention |
| 3 | Week 1 | Clicks "Ramesh K." → **Right panel** loads Ramesh's weekly summary: Adherence 86%, Meals 9/14, Swaps 3/9, Flag: "Feeling unwell after Glimepiride" | Reviews Ramesh's data in 30 seconds |
| 4 | Week 1 | Flag detail: "Feeling unwell — 5 Oct, 9:30 AM. Coordinator called. Mild nausea." | Decides whether to adjust dosing in next visit |
| 5 | Week 1 | Clicks `[✅ Reviewed]` for Ramesh | Ramesh's summary marked as reviewed. Flag badge disappears from sidebar. |
| 6 | Week 1 | Clicks "Suresh G." → Right panel loads Suresh's summary: Adherence 92%, Meals 11/14, No flags | Quick scan — all good |
| 7 | Week 1 | Clicks `[✅ Reviewed]` for Suresh | Done. Both patients reviewed in under 2 minutes. |
| 8 | Week 3 | Sidebar shows: Ramesh 90% ↑, Suresh 88% ↓ (mild slip) | Notes trends at a glance |
| 9 | Day 90 | Ramesh's lab card: "HbA1c: 8.2 → 7.6. Drop: 0.6 points 🎉" | Sees the system works |
| 10 | Post-90 | — | Recommends Project Pulse to the next patient → trust loop closes |

**What the doctor does NOT do on the platform:** Prescribe, diagnose, or send free-text medical advice to any patient.

---

### 14.5 Coordinator's Happy Flow (Safety Net — Web App)

The coordinator is the human safety net. They only act on alerts.

```mermaid
graph TD
    classDef web fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000

    A["Login: enters code COORD2026<br/>→ Redirected to /coordinator"]:::web
    B["Dashboard shows: 0 active alerts<br/>Quiet day ✅"]:::web
    C["Ramesh taps 'Feeling unwell'<br/>🔴 Alert appears with pulsing red"]:::web
    D["Coordinator reads context:<br/>'After Glimepiride, mild nausea'"]:::web
    E["Clicks '📞 Mark as Called'<br/>Calls Ramesh on phone"]:::web
    F["Adds note: 'Mild nausea.<br/>Advised to rest. Will monitor.'"]:::web
    G["Alert moves to 'Resolved' list"]:::web

    A --> B --> C --> D --> E --> F --> G
```

**Step-by-step:**

| Step | When | What Coordinator sees | Coordinator's action |
|---|---|---|---|
| 1 | Morning | Login → enters `COORD2026` → `/coordinator` | Dashboard loads with alert queue |
| 2 | Morning | "Active Alerts: 0" — green status | No action needed |
| 3 | 9:30 AM | 🔴 New alert flashes (pulsing animation): "Ramesh Kumar — Feeling unwell button tap. After Glimepiride 1mg. Severity: 🟠 MEDIUM" | Reads the alert |
| 4 | 9:30 AM | Sees Ramesh's phone number and context | Clicks "📞 Mark as Called" — calls Ramesh |
| 5 | 9:45 AM | Call complete | Adds note: "Called Ramesh. Mild nausea after taking Glimepiride on empty stomach. Advised to eat before taking. No escalation needed." |
| 6 | 9:45 AM | Alert moves from "Active" to "Resolved" with timestamp and note | Done |
| 7 | End of day | Coordinator checks: "Resolved today: 1. Active: 0." | Day complete |

**Escalation rules (implemented even in hackathon):**

| Severity | Response time | Action |
|---|---|---|
| 🟡 Low (single missed dose) | Next weekly summary | Log only, no call |
| 🟠 Medium ("feeling unwell", 2 missed in a row) | Within 15 minutes | Coordinator calls Ramesh |
| 🔴 High (3+ missed, distress keywords) | Within 5 minutes | Coordinator calls + alerts son + flags doctor |
| 🚨 Critical (self-harm keywords, loss of consciousness) | Immediate | Coordinator calls + 108 emergency + son + doctor |

---

## 15. Post-Hackathon Production Path

What changes when moving from hackathon prototype to real product:

| Hackathon (Now) | Production (Later) |
|---|---|
| WhatsApp test mode (5 numbers) | WhatsApp Cloud API with business verification (unlimited numbers) |
| Neon PostgreSQL (free tier, 0.5 GB) | Managed PostgreSQL (dedicated, auto-scaling) |
| Upstash Redis (free tier, 10K cmds/day) | Managed Redis (dedicated, higher throughput) |
| 2 seed patients (Ramesh + Suresh) | Multi-patient, multi-city, multi-doctor |
| Mobile-only web app (390×844) | Responsive web app (mobile + tablet + desktop) |
| Pre-recorded `.ogg` voice notes | Google Cloud TTS (Hindi) for dynamic voice generation |
| ngrok tunnel | Cloud hosting (AWS/GCP) with proper domain and SSL |
| No authentication (access codes) | JWT auth for web app, RBAC for roles, phone OTP |
| Local dev server | Docker containers, CI/CD via GitHub Actions |
| ₹0 | ~₹80/patient/month (see production cost estimate below) |

### Production Cost Estimate (per 100 patients/month)

| Item | Monthly Cost |
|---|---|
| WhatsApp Cloud API (1,000 free convos, then ~₹0.50/convo) | ₹0–2,500 |
| Server (2 vCPU, 4GB RAM) | ₹3,000 |
| PostgreSQL (managed, small) | ₹2,000 |
| Redis (managed, small) | ₹1,500 |
| Google Cloud TTS | ₹1,000 |
| S3 storage | ₹500 |
| **Total** | **₹8,000–10,500/month** |
| **Per patient** | **₹80–105/month** |

---

> **This architecture supports all 17 MVP features** from [context.md §11](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md), reflects the bucket audit from [context.md §12](file:///Users/iamprince/Desktop/projectPulse/Docs/context.md), and is designed to be built and demoed within a hackathon time constraint at zero infrastructure cost.
