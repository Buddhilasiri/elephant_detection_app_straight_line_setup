// Import required modules
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors()); // To handle CORS errors
app.use(express.json()); // Middleware to parse JSON requests

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Endpoint to receive sensor events
app.post('/sensor_event', (req, res) => {
  const sensorTag = req.body.sensor_tag;

  if (!['A', 'B', 'C'].includes(sensorTag)) {
    return res.status(400).json({ error: 'Invalid sensor tag' });
  }

  const query = 'INSERT INTO sensor_events (sensor_tag) VALUES (?)';
  db.query(query, [sensorTag], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ status: 'success', sensor: sensorTag });
  });
});

// Endpoint to get the latest sensor event
app.get('/latest_event', (req, res) => {
  const query = 'SELECT sensor_tag, detection_time FROM sensor_events ORDER BY detection_time DESC LIMIT 1';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'No events found' });
    }
  });
});

// New endpoint to get today's detection count
app.get('/detection_count', (req, res) => {
  const query = `SELECT COUNT(*) AS count 
                 FROM sensor_events 
                 WHERE DATE(detection_time) = CURDATE()`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ count: results[0].count });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
