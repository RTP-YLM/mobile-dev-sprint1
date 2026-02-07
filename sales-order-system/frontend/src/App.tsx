import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SalesOrderList from './pages/SalesOrderList'
import CreateSalesOrder from './pages/CreateSalesOrder'
import ShipmentList from './pages/ShipmentList'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="sidebar">
          <h2>📦 Sales Order</h2>
          <ul>
            <li><NavLink to="/">Dashboard</NavLink></li>
            <li><NavLink to="/orders">รายการ SO</NavLink></li>
            <li><NavLink to="/create">สร้าง SO</NavLink></li>
            <li><NavLink to="/shipments">รายการจัดส่ง</NavLink></li>
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<SalesOrderList />} />
            <Route path="/create" element={<CreateSalesOrder />} />
            <Route path="/shipments" element={<ShipmentList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
