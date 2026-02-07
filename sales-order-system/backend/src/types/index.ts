// Types ตาม schema.sql

export interface Customer {
  id: number;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  stock_qty: number;
  is_active: boolean;
}

export interface SalesOrder {
  id: number;
  so_number: string;
  order_date: Date;
  customer_id: number;
  status: 'draft' | 'pending' | 'approved' | 'picking' | 'shipped' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
  items?: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: number;
  sales_order_id: number;
  product_id: number;
  qty: number;
  unit_price: number;
  amount: number;
}

export interface Delivery {
  id: number;
  do_number: string;
  sales_order_id: number;
  delivery_date: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  driver_name?: string;
  vehicle_no?: string;
  notes?: string;
}
