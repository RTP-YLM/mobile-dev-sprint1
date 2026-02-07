import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /api/customers - ดึงรายชื่อลูกค้า
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM so_system.customers WHERE is_active = true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/customers - สร้างลูกค้าใหม่
router.post('/', async (req, res) => {
  const { code, name, address, phone, email } = req.body;
  try {
    const result = await query(
      `INSERT INTO so_system.customers (code, name, address, phone, email) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [code, name, address, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

export default router;
