import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isStaff } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [buses] = await pool.execute('SELECT * FROM buses');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isStaff, async (req, res) => {
  try {
    const { bus_number, bus_name, bus_index, total_seats, bus_type, seat_layout } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO buses (bus_number, bus_name, bus_index, total_seats, bus_type, seat_layout) VALUES (?, ?, ?, ?, ?, ?)',
      [bus_number, bus_name, bus_index, total_seats, bus_type, seat_layout]
    );
    res.status(201).json({ message: 'Bus added successfully', busId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isStaff, async (req, res) => {
  try {
    const { bus_number, bus_name, bus_index, bus_type, seat_layout, total_seats } = req.body;
    await pool.execute(
      'UPDATE buses SET bus_number = ?, bus_name = ?, bus_index = ?, bus_type = ?, seat_layout = ?, total_seats = ? WHERE id = ?',
      [bus_number, bus_name, bus_index, bus_type, seat_layout, total_seats, req.params.id]
    );
    res.json({ message: 'Bus updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isStaff, async (req, res) => {
  try {
    await pool.execute('DELETE FROM buses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
