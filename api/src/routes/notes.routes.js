import express from "express";
import { getByLeadId, create } from "../controllers/notes.controller.js";

const router = express.Router();

/**
 * GET /leads/:id/notes
 */
router.get("/leads/:id/notes", getByLeadId);

/**
 * POST /leads/:id/notes
 */
router.post("/leads/:id/notes", create);

export default router;
