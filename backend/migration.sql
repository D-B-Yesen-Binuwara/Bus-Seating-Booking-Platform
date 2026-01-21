-- Migration script to add seat_layout column to existing buses table
USE bus_booking;

ALTER TABLE buses ADD COLUMN IF NOT EXISTS seat_layout TEXT AFTER bus_type;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS bus_index VARCHAR(50) AFTER bus_name;

-- Update schedules table structure
ALTER TABLE schedules 
  DROP COLUMN IF EXISTS arrival_time,
  MODIFY COLUMN departure_time TIME NOT NULL,
  ADD COLUMN IF NOT EXISTS schedule_date DATE NOT NULL AFTER departure_time;

-- Add reserved_seats column to schedules table
ALTER TABLE schedules ADD COLUMN IF NOT EXISTS reserved_seats TEXT DEFAULT '[]';
