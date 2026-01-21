import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isStaff } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [schedules] = await pool.execute(`
      SELECT s.*, b.bus_name, b.bus_number, b.seat_layout, r.source, r.destination,
      COALESCE(s.reserved_seats, '[]') as reserved_seats
      FROM schedules s
      JOIN buses b ON s.bus_id = b.id
      JOIN routes r ON s.route_id = r.id
      WHERE s.status = 'active' AND s.schedule_date >= CURDATE()
      ORDER BY s.schedule_date, s.departure_time
    `);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isStaff, async (req, res) => {
  try {
    const { bus_id, route_id, departure_time, start_date, end_date, price } = req.body;
    const [bus] = await pool.execute('SELECT total_seats FROM buses WHERE id = ?', [bus_id]);
    
    const start = new Date(start_date);
    const end = new Date(end_date);
    const schedules = [];
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      await pool.execute(
        'INSERT INTO schedules (bus_id, route_id, departure_time, schedule_date, price, available_seats, booked_seats) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [bus_id, route_id, departure_time, dateStr, price, bus[0].total_seats, '[]']
      );
      schedules.push(dateStr);
    }
    
    res.status(201).json({ message: `${schedules.length} schedules created successfully`, dates: schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [schedules] = await pool.execute(`
      SELECT s.*, b.bus_name, b.bus_number, b.total_seats, b.seat_layout, r.source, r.destination 
      FROM schedules s
      JOIN buses b ON s.bus_id = b.id
      JOIN routes r ON s.route_id = r.id
      WHERE s.id = ?
    `, [req.params.id]);
    
    if (schedules.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json(schedules[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isStaff, async (req, res) => {
  try {
    await pool.execute('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/reserve', authenticateToken, isStaff, async (req, res) => {
  try {
    const { reserved_seats } = req.body;
    
    // Get current schedule data
    const [schedules] = await pool.execute(
      'SELECT booked_seats, reserved_seats FROM schedules WHERE id = ?',
      [req.params.id]
    );
    
    if (schedules.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const bookedSeats = JSON.parse(schedules[0].booked_seats || '[]');
    const oldReservedSeats = JSON.parse(schedules[0].reserved_seats || '[]');
    
    // Calculate available seats: total - booked - reserved
    const [buses] = await pool.execute(
      'SELECT total_seats FROM buses WHERE id = (SELECT bus_id FROM schedules WHERE id = ?)',
      [req.params.id]
    );
    
    const totalSeats = buses[0].total_seats;
    const availableSeats = totalSeats - bookedSeats.length - reserved_seats.length;
    
    await pool.execute(
      'UPDATE schedules SET reserved_seats = ?, available_seats = ? WHERE id = ?',
      [JSON.stringify(reserved_seats), availableSeats, req.params.id]
    );
    
    res.json({ message: 'Reservations saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
