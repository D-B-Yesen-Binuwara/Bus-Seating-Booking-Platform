import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isStaff } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [routes] = await pool.execute('SELECT * FROM routes');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, isStaff, async (req, res) => {
  try {
    const { source, destination, distance, duration } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO routes (source, destination, distance, duration) VALUES (?, ?, ?, ?)',
      [source, destination, distance, duration]
    );
    res.status(201).json({ message: 'Route added successfully', routeId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, isStaff, async (req, res) => {
  try {
    const { source, destination, distance, duration } = req.body;
    await pool.execute(
      'UPDATE routes SET source = ?, destination = ?, distance = ?, duration = ? WHERE id = ?',
      [source, destination, distance, duration, req.params.id]
    );
    res.json({ message: 'Route updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, isStaff, async (req, res) => {
  try {
    await pool.execute('DELETE FROM routes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
