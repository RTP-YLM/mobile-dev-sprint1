import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /api/products - ดึงรายการสินค้า
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM so_system.products WHERE is_active = true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/products - สร้างสินค้าใหม่
router.post('/', async (req, res) => {
  const { code, name, description, unit, price, stock_qty } = req.body;
  try {
    const result = await query(
      `INSERT INTO so_system.products (code, name, description, unit, price, stock_qty) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [code, name, description, unit || 'ชิ้น', price, stock_qty || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;
