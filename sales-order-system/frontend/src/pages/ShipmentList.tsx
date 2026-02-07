function ShipmentList() {
  const shipments = [
    { id: 'SHP-001', so: 'SO-2026-0154', customer: 'หจก.สมชาย', date: '02/02/2026', tracking: 'TH123456789', status: 'shipped' },
    { id: 'SHP-002', so: 'SO-2026-0153', customer: 'บจก.ทดสอบ', date: '01/02/2026', tracking: 'TH987654321', status: 'delivered' },
    { id: 'SHP-003', so: 'SO-2026-0152', customer: 'ร้านค้าออนไลน์', date: '31/01/2026', tracking: 'TH456789123', status: 'delivered' },
  ]

  const statusText: Record<string, string> = {
    pending: 'รอจัดส่ง',
    shipped: 'กำลังจัดส่ง',
    delivered: 'ส่งถึงแล้ว',
  }

  return (
    <div>
      <h1>🚚 รายการจัดส่ง</h1>
      
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>เลขจัดส่ง</th>
              <th>SO#</th>
              <th>ลูกค้า</th>
              <th>วันที่ส่ง</th>
              <th>Tracking</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(ship => (
              <tr key={ship.id}>
                <td>{ship.id}</td>
                <td>{ship.so}</td>
                <td>{ship.customer}</td>
                <td>{ship.date}</td>
                <td>{ship.tracking}</td>
                <td><span className={`status ${ship.status}`}>{statusText[ship.status]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShipmentList
