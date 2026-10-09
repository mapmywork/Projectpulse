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
