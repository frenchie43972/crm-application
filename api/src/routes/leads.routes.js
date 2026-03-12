import express from "express";
import {
  getAll,
  getById,
  create,
  deleteById,
  updateById,
} from "../controllers/leads.controller.js";

const router = express.Router();

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

router.delete("/:id", deleteById);

router.put("/:id", updateById);

export default router;
