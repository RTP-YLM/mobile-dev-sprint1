import { Router } from 'express';
import { query } from '../db';

const router = Router();

// POST /api/deliveries - สร้างใบจัดส่ง
router.post('/', async (req, res) => {
  const { sales_order_id, driver_name, vehicle_no, notes } = req.body;
  try {
    // Generate DO number
    const doNum = `DO${Date.now().toString().slice(-8)}`;
    
    const result = await query(
      `INSERT INTO so_system.deliveries (do_number, sales_order_id, driver_name, vehicle_no, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doNum, sales_order_id, driver_name, vehicle_no, notes]
    );
    
    // Update SO status to 'shipped'
    await query(`UPDATE so_system.sales_orders SET status = 'shipped' WHERE id = $1`, [sales_order_id]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// PATCH /api/deliveries/:id/status - อัพเดทสถานะจัดส่ง
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      `UPDATE so_system.deliveries SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // If delivered, update SO to completed
    if (status === 'delivered') {
      await query(
        `UPDATE so_system.sales_orders SET status = 'completed' WHERE id = $1`,
        [result.rows[0].sales_order_id]
      );
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

export default router;
