import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express());

/**
 *
 * Health Check
 * It is a simple endpoint used to verify that the service is running and able to respond to requests.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
