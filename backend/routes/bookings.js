import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isStaff } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'staff' 
      ? `SELECT b.*, s.departure_time, s.schedule_date, r.source, r.destination, bus.bus_name, u.name as user_name, u.email, u.phone
         FROM bookings b
         JOIN schedules s ON b.schedule_id = s.id
         JOIN routes r ON s.route_id = r.id
         JOIN buses bus ON s.bus_id = bus.id
         JOIN users u ON b.user_id = u.id`
      : `SELECT b.*, s.departure_time, s.schedule_date, r.source, r.destination, bus.bus_name
         FROM bookings b
         JOIN schedules s ON b.schedule_id = s.id
         JOIN routes r ON s.route_id = r.id
         JOIN buses bus ON s.bus_id = bus.id
         WHERE b.user_id = ?`;
    
    const [bookings] = req.user.role === 'staff' 
      ? await pool.execute(query)
      : await pool.execute(query, [req.user.id]);
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { schedule_id, seat_numbers, total_amount } = req.body;
    const seats = Array.isArray(seat_numbers) ? seat_numbers : seat_numbers.split(',').map(s => s.trim());
    
    const [schedule] = await connection.execute(
      'SELECT available_seats, booked_seats FROM schedules WHERE id = ? FOR UPDATE',
      [schedule_id]
    );
    
    const bookedSeats = JSON.parse(schedule[0].booked_seats || '[]');
    const conflict = seats.some(seat => bookedSeats.includes(seat.toString()));
    
    if (conflict) {
      throw new Error('Some seats are already booked');
    }
    
    if (schedule[0].available_seats < seats.length) {
      throw new Error('Not enough seats available');
    }
    
    const [result] = await connection.execute(
      'INSERT INTO bookings (user_id, schedule_id, seat_numbers, total_amount) VALUES (?, ?, ?, ?)',
      [req.user.id, schedule_id, Array.isArray(seat_numbers) ? seat_numbers.join(',') : seat_numbers, total_amount]
    );
    
    const updatedBookedSeats = [...bookedSeats, ...seats.map(s => s.toString())];
    await connection.execute(
      'UPDATE schedules SET available_seats = available_seats - ?, booked_seats = ? WHERE id = ?',
      [seats.length, JSON.stringify(updatedBookedSeats), schedule_id]
    );
    
    await connection.commit();
    res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

router.patch('/:id/cancel', authenticateToken, isStaff, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [booking] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [req.params.id]
    );
    
    if (booking.length === 0) {
      throw new Error('Booking not found');
    }
    
    const seats = booking[0].seat_numbers.split(',');
    
    const [schedule] = await connection.execute(
      'SELECT booked_seats FROM schedules WHERE id = ?',
      [booking[0].schedule_id]
    );
    
    const bookedSeats = JSON.parse(schedule[0].booked_seats || '[]');
    const updatedSeats = bookedSeats.filter(seat => !seats.includes(seat));
    
    await connection.execute(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );
    
    await connection.execute(
      'UPDATE schedules SET available_seats = available_seats + ?, booked_seats = ? WHERE id = ?',
      [seats.length, JSON.stringify(updatedSeats), booking[0].schedule_id]
    );
    
    await connection.commit();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

export default router;
