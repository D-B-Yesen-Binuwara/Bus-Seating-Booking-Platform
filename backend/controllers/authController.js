import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );
    
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password, phone } = req.body;

    // Get current user data
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    let hashedPassword = user.password;

    // Hash new password if provided
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile (name, password, phone)
    await pool.execute(
      'UPDATE users SET name = ?, password = ?, phone = ? WHERE id = ?',
      [name || user.name, hashedPassword, phone || user.phone, userId]
    );

    // Get updated user data
    const [updatedUser] = await pool.execute('SELECT id, name, email, phone, role FROM users WHERE id = ?', [userId]);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
