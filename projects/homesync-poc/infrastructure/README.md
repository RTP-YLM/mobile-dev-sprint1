# HomeSync POC - Infrastructure

## 🚀 Quick Start

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f influxdb

# Stop
docker-compose down

# Stop and remove data (ระวัง!)
docker-compose down -v
```

## 📊 Services

### InfluxDB
- **URL**: http://localhost:8086
- **Username**: `admin`
- **Password**: `adminpassword123`
- **Org**: `homesync`
- **Bucket**: `poc_telemetry`
- **Token**: `homesync-poc-token-12345`

### Grafana (Optional)
- **URL**: http://localhost:3001
- **Username**: `admin`
- **Password**: `admin123`

## 🔧 Configuration

### InfluxDB Setup Token

หลังจาก start services ให้ get token จริง:

```bash
# ดู token ที่สร้างอัตโนมัติ
docker exec homesync-influxdb influx auth list
```

หรือสร้าง token ใหม่ผ่าน UI:
1. ไปที่ http://localhost:8086
2. Login → Data → Tokens → Generate Token

### Environment Variables for Backend

```bash
# .env file ใน backend/
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=homesync-poc-token-12345
INFLUXDB_ORG=homesync
INFLUXDB_BUCKET=poc_telemetry
```

## 🌐 HiveMQ Cloud Setup

1. ไปที่ https://www.hivemq.com/mqtt-cloud/
2. Sign up ฟรี (Free tier รองรับ 100 concurrent connections)
3. Create new cluster
4. ไปที่ Access Management → Create Credentials
5. บันทึก:
   - Cluster URL: `xxx.hivemq.cloud`
   - Port: `8883` (TLS)
   - Username/Password ที่สร้าง

## 📋 Backup Data

```bash
# Backup InfluxDB
docker exec homesync-influxdb influx backup /backup
docker cp homesync-influxdb:/backup ./backup/$(date +%Y%m%d)

# Restore
docker exec homesync-influxdb influx restore /backup
```

## 🐛 Troubleshooting

### Port already in use
```bash
# หา process ที่ใช้ port 8086
sudo lsof -i :8086

# Kill process หรือแก้ไข port ใน docker-compose.yml
```

### InfluxDB ไม่ start
```bash
# ลบ volume แล้ว start ใหม่ (ข้อมูลจะหาย!)
docker-compose down -v
docker-compose up -d
```

## 📈 Resource Usage (Estimated)

| Service | CPU | Memory | Disk |
|---------|-----|--------|------|
| InfluxDB | 0.5 core | 512MB | 10GB |
| Grafana | 0.2 core | 256MB | 1GB |
| **Total** | 0.7 core | 768MB | 11GB |
