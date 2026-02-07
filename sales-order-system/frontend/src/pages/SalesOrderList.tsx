function SalesOrderList() {
  const orders = [
    { id: 'SO-2026-0156', customer: 'บริษัท ABC จำกัด', date: '02/02/2026', total: 45000, status: 'pending' },
    { id: 'SO-2026-0155', customer: 'ร้าน XYZ', date: '01/02/2026', total: 12500, status: 'confirmed' },
    { id: 'SO-2026-0154', customer: 'หจก.สมชาย', date: '01/02/2026', total: 78900, status: 'shipped' },
    { id: 'SO-2026-0153', customer: 'บจก.ทดสอบ', date: '31/01/2026', total: 23400, status: 'delivered' },
    { id: 'SO-2026-0152', customer: 'ร้านค้าออนไลน์', date: '30/01/2026', total: 56700, status: 'delivered' },
  ]

  const statusText: Record<string, string> = {
    pending: 'รอยืนยัน',
    confirmed: 'ยืนยันแล้ว',
    shipped: 'จัดส่งแล้ว',
    delivered: 'ส่งถึงแล้ว',
  }

  return (
    <div>
      <h1>📋 รายการ Sales Order</h1>
      
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>เลขที่ SO</th>
              <th>ลูกค้า</th>
              <th>วันที่</th>
              <th>ยอดรวม</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>฿{order.total.toLocaleString()}</td>
                <td><span className={`status ${order.status}`}>{statusText[order.status]}</span></td>
                <td>
                  <button>ดู</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalesOrderList
