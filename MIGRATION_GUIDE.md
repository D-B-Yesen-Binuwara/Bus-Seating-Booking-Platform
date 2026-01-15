# Database Migration Guide

Since MySQL is not in your PATH, use MySQL Workbench to run the migration:

## Steps:

1. Open **MySQL Workbench**
2. Connect to your database
3. Copy and paste the following SQL commands:

```sql
USE bus_booking;

ALTER TABLE buses ADD COLUMN IF NOT EXISTS seat_layout TEXT AFTER bus_type;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS bus_index VARCHAR(50) AFTER bus_name;
```

4. Click **Execute** (lightning bolt icon)
5. Restart your backend server

## What's New:

### Staff Dashboard Features:
- ✅ Side navigation (Bus Info, Routes, Schedules, Bookings, Logout)
- ✅ Bus Management with table view
- ✅ Edit bus details inline
- ✅ Click on seat count to edit layout in popup
- ✅ Delete buses
- ✅ Add new buses with custom layout
- ✅ Bus Type options: A/C, Non A/C, or custom input
- ✅ Bus Index field added
- ✅ Route Management (CRUD operations)
- ✅ Schedule Management
- ✅ Booking Management with cancel option

### Bus Information Fields:
- Bus Number
- Bus Name
- Bus Index (optional)
- Bus Type (A/C, Non A/C, or custom)
- Seat Layout (7x10 grid designer)

That's it! Your application is ready to use.
