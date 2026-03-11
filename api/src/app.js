import express from 'express';
import cors from 'cors';

import router from './routes/leads.routes.js';

const app = express();
const leadsRouter = router;

// Middleware
app.use(cors());
app.use(express.json());

// Mounted routes
app.use('/leads', leadsRouter);
export default app;
