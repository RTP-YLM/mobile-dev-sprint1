import express from 'express';
import cors from 'cors';

// Routes
import customersRouter from './routes/customers';
import productsRouter from './routes/products';
import salesOrdersRouter from './routes/sales-orders';
import deliveriesRouter from './routes/deliveries';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sales-order-backend' });
});

// API Routes
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales-orders', salesOrdersRouter);
app.use('/api/deliveries', deliveriesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sales Order Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   - GET/POST /api/customers`);
  console.log(`   - GET/POST /api/products`);
  console.log(`   - GET/POST /api/sales-orders`);
  console.log(`   - PATCH    /api/sales-orders/:id/status`);
  console.log(`   - POST     /api/deliveries`);
  console.log(`   - PATCH    /api/deliveries/:id/status`);
});
