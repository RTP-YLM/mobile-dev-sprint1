const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const config = require('../config');

class InfluxDBService {
  constructor() {
    this.client = new InfluxDB({
      url: config.INFLUXDB.URL,
      token: config.INFLUXDB.TOKEN
    });
    
    this.writeApi = this.client.getWriteApi(
      config.INFLUXDB.ORG,
      config.INFLUXDB.BUCKET,
      'ns'
    );

    this.queryApi = this.client.getQueryApi(config.INFLUXDB.ORG);
  }

  async writeTelemetry(measurement, value, tags = {}) {
    try {
      const point = new Point(measurement)
        .floatField('value', value)
        .timestamp(new Date());

      // Add tags
      Object.entries(tags).forEach(([key, val]) => {
        point.tag(key, String(val));
      });

      // Default tags
      point.tag('device', 'node1');
      point.tag('project', 'poc');

      this.writeApi.writePoint(point);
      await this.writeApi.flush();
      
      console.log(`💾 Written to InfluxDB: ${measurement} = ${value}`);
    } catch (err) {
      console.error('❌ InfluxDB write error:', err);
      throw err;
    }
  }

  async writePowerReading(power, voltage, current) {
    const timestamp = new Date();
    const tags = { device: 'node1', project: 'poc' };

    try {
      // Write power
      const powerPoint = new Point('power')
        .floatField('value', power)
        .tag('device', 'node1')
        .tag('project', 'poc')
        .timestamp(timestamp);
      this.writeApi.writePoint(powerPoint);

      // Write voltage
      const voltagePoint = new Point('voltage')
        .floatField('value', voltage)
        .tag('device', 'node1')
        .tag('project', 'poc')
        .timestamp(timestamp);
      this.writeApi.writePoint(voltagePoint);

      // Write current
      const currentPoint = new Point('current')
        .floatField('value', current)
        .tag('device', 'node1')
        .tag('project', 'poc')
        .timestamp(timestamp);
      this.writeApi.writePoint(currentPoint);

      await this.writeApi.flush();
      console.log(`💾 Written readings: ${power}W, ${voltage}V, ${current}A`);
    } catch (err) {
      console.error('❌ Error writing readings:', err);
      throw err;
    }
  }

  async getLatestReadings(minutes = 5) {
    const query = `
      from(bucket: "${config.INFLUXDB.BUCKET}")
        |> range(start: -${minutes}m)
        |> filter(fn: (r) => r["device"] == "node1")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["_measurement"] == "power" or r["_measurement"] == "voltage" or r["_measurement"] == "current")
        |> last()
    `;

    try {
      const result = {};
      const rows = await this.queryApi.collectRows(query);
      
      rows.forEach(row => {
        result[row._measurement] = {
          value: row._value,
          time: row._time
        };
      });

      return result;
    } catch (err) {
      console.error('❌ InfluxDB query error:', err);
      throw err;
    }
  }

  async getHistoricalData(measurement, hours = 24) {
    const query = `
      from(bucket: "${config.INFLUXDB.BUCKET}")
        |> range(start: -${hours}h)
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["device"] == "node1")
        |> filter(fn: (r) => r["_field"] == "value")
        |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    try {
      const rows = await this.queryApi.collectRows(query);
      return rows.map(row => ({
        time: row._time,
        value: row._value
      }));
    } catch (err) {
      console.error('❌ InfluxDB historical query error:', err);
      throw err;
    }
  }

  async close() {
    await this.writeApi.close();
  }
}

module.exports = new InfluxDBService();
