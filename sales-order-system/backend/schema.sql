-- =============================================
-- Sales Order System - Database Schema
-- Dev: ต้น (Dev-1)
-- Date: 2026-02-02
-- =============================================

-- Schema
CREATE SCHEMA IF NOT EXISTS so_system;

-- =============================================
-- Master Tables
-- =============================================

-- ลูกค้า
CREATE TABLE so_system.customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สินค้า
CREATE TABLE so_system.products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    unit VARCHAR(20) DEFAULT 'ชิ้น',
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    stock_qty DECIMAL(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ผู้ใช้งาน
CREATE TABLE so_system.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'sales', 'warehouse')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Transaction Tables
-- =============================================

-- ใบสั่งขาย (Header)
CREATE TABLE so_system.sales_orders (
    id SERIAL PRIMARY KEY,
    so_number VARCHAR(20) UNIQUE NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id INTEGER NOT NULL REFERENCES so_system.customers(id),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending', 'approved', 'picking', 'shipped', 'completed', 'cancelled')),
    total_amount DECIMAL(14, 2) DEFAULT 0,
    notes TEXT,
    created_by INTEGER REFERENCES so_system.users(id),
    approved_by INTEGER REFERENCES so_system.users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- รายการสินค้าใน SO (Detail)
CREATE TABLE so_system.sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INTEGER NOT NULL REFERENCES so_system.sales_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES so_system.products(id),
    qty DECIMAL(12, 2) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ใบจัดส่ง
CREATE TABLE so_system.deliveries (
    id SERIAL PRIMARY KEY,
    do_number VARCHAR(20) UNIQUE NOT NULL,
    sales_order_id INTEGER NOT NULL REFERENCES so_system.sales_orders(id),
    delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
    driver_name VARCHAR(100),
    vehicle_no VARCHAR(20),
    notes TEXT,
    delivered_by INTEGER REFERENCES so_system.users(id),
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_so_customer ON so_system.sales_orders(customer_id);
CREATE INDEX idx_so_status ON so_system.sales_orders(status);
CREATE INDEX idx_so_date ON so_system.sales_orders(order_date);
CREATE INDEX idx_delivery_so ON so_system.deliveries(sales_order_id);

-- =============================================
-- Sample Data
-- =============================================
INSERT INTO so_system.users (username, password_hash, full_name, role) VALUES
('admin', '$2b$10$hash', 'ผู้ดูแลระบบ', 'admin'),
('sales1', '$2b$10$hash', 'สมชาย ขายดี', 'sales'),
('wh1', '$2b$10$hash', 'สมหญิง คลังสินค้า', 'warehouse');

INSERT INTO so_system.customers (code, name, address, phone) VALUES
('C001', 'บริษัท ABC จำกัด', '123 ถนนสุขุมวิท กรุงเทพฯ', '02-123-4567'),
('C002', 'ร้านค้า XYZ', '456 ถนนพหลโยธิน กรุงเทพฯ', '02-987-6543');

INSERT INTO so_system.products (code, name, unit, price, stock_qty) VALUES
('P001', 'สินค้า A', 'ชิ้น', 100.00, 500),
('P002', 'สินค้า B', 'กล่อง', 250.00, 200),
('P003', 'สินค้า C', 'แพ็ค', 180.00, 300);
