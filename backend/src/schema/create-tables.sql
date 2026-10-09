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
