import express from "express";
import cors from "cors";

import router from "./routes/leads.routes.js";
import notesRoute from "./routes/notes.routes.js";

const app = express();
const leadsRouter = router;

// Middleware
app.use(cors());
app.use(express.json());

// Mounted routes
app.use("/leads", leadsRouter);
app.use(notesRoute);

export default app;
