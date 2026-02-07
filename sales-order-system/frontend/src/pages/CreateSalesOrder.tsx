import { useState } from 'react'

function CreateSalesOrder() {
  const [formData, setFormData] = useState({
    customer: '',
    address: '',
    product: '',
    quantity: 1,
    price: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('สร้าง SO สำเร็จ! (Demo)')
    console.log(formData)
  }

  return (
    <div>
      <h1>➕ สร้าง Sales Order</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ลูกค้า</label>
            <select 
              value={formData.customer}
              onChange={e => setFormData({...formData, customer: e.target.value})}
            >
              <option value="">-- เลือกลูกค้า --</option>
              <option value="1">บริษัท ABC จำกัด</option>
              <option value="2">ร้าน XYZ</option>
              <option value="3">หจก.สมชาย</option>
            </select>
          </div>

          <div className="form-group">
            <label>ที่อยู่จัดส่ง</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              placeholder="ที่อยู่สำหรับจัดส่งสินค้า"
            />
          </div>

          <div className="form-group">
            <label>สินค้า</label>
            <select
              value={formData.product}
              onChange={e => setFormData({...formData, product: e.target.value})}
            >
              <option value="">-- เลือกสินค้า --</option>
              <option value="1">สินค้า A - ฿1,500</option>
              <option value="2">สินค้า B - ฿2,300</option>
              <option value="3">สินค้า C - ฿890</option>
            </select>
          </div>

          <div className="form-group">
            <label>จำนวน</label>
            <input 
              type="number" 
              min="1"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
            />
          </div>

          <button type="submit">💾 บันทึก SO</button>
        </form>
      </div>
    </div>
  )
}

export default CreateSalesOrder
