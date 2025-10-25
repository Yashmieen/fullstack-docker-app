const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 5000;

// Function to connect to Postgres with retries
async function connectWithRetry() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'testdb',
    port: process.env.DB_PORT || 5432,
  });

  let retries = 5;
  while (retries) {
    try {
      await client.connect();
      console.log('✅ Connected to Postgres');
      return client;
    } catch (err) {
      console.error(`❌ Failed to connect to Postgres (retries left: ${retries - 1})`, err.code);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000)); // wait 5s
    }
  }
  console.error('❌ Could not connect to Postgres after retries, exiting...');
  process.exit(1);
}

let dbClient;

(async () => {
  dbClient = await connectWithRetry();

  // Start Express server only after DB connection succeeds
  app.listen(port, () => {
    console.log(`🚀 Backend listening at http://localhost:${port}`);
  });
})();

// Routes
app.get('/api', async (req, res) => {
  try {
    const result = await dbClient.query('SELECT NOW() AS time');
    res.send(`Hello from Express + Postgres! Server time: ${result.rows[0].time}`);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).send('Database error');
  }
});
