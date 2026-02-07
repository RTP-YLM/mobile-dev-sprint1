function Dashboard() {
  return (
    <div>
      <h1>📊 Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>156</h3>
          <p>SO ทั้งหมด</p>
        </div>
        <div className="stat-card">
          <h3>23</h3>
          <p>รอยืนยัน</p>
        </div>
        <div className="stat-card">
          <h3>45</h3>
          <p>กำลังจัดส่ง</p>
        </div>
        <div className="stat-card">
          <h3>฿1.2M</h3>
          <p>ยอดขายเดือนนี้</p>
        </div>
      </div>

      <div className="card">
        <h2>📋 SO ล่าสุด</h2>
        <table>
          <thead>
            <tr>
              <th>SO#</th>
              <th>ลูกค้า</th>
              <th>วันที่</th>
              <th>ยอด</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SO-2026-0156</td>
              <td>บริษัท ABC จำกัด</td>
              <td>02/02/2026</td>
              <td>฿45,000</td>
              <td><span className="status pending">รอยืนยัน</span></td>
            </tr>
            <tr>
              <td>SO-2026-0155</td>
              <td>ร้าน XYZ</td>
              <td>01/02/2026</td>
              <td>฿12,500</td>
              <td><span className="status confirmed">ยืนยันแล้ว</span></td>
            </tr>
            <tr>
              <td>SO-2026-0154</td>
              <td>หจก.สมชาย</td>
              <td>01/02/2026</td>
              <td>฿78,900</td>
              <td><span className="status shipped">จัดส่งแล้ว</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
