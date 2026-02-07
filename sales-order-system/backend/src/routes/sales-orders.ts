import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /api/sales-orders - ดึงรายการ SO
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT so.*, c.name as customer_name 
      FROM so_system.sales_orders so
      JOIN so_system.customers c ON so.customer_id = c.id
      ORDER BY so.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/sales-orders - สร้าง SO ใหม่
router.post('/', async (req, res) => {
  const { customer_id, items, notes } = req.body;
  try {
    // Generate SO number
    const soNum = `SO${Date.now().toString().slice(-8)}`;
    
    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + (item.qty * item.unit_price), 0);
    
    // Insert header
    const soResult = await query(
      `INSERT INTO so_system.sales_orders (so_number, customer_id, total_amount, notes) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [soNum, customer_id, total, notes]
    );
    const so = soResult.rows[0];
    
    // Insert items
    for (const item of items) {
      await query(
        `INSERT INTO so_system.sales_order_items (sales_order_id, product_id, qty, unit_price, amount) 
         VALUES ($1, $2, $3, $4, $5)`,
        [so.id, item.product_id, item.qty, item.unit_price, item.qty * item.unit_price]
      );
    }
    
    res.status(201).json(so);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sales order' });
  }
});

// PATCH /api/sales-orders/:id/status - อัพเดทสถานะ
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      `UPDATE so_system.sales_orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sales order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
