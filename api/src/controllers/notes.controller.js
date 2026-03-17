import db from "../db/database.js";
import { getNotesByLeadId, createNote } from "../db/queries/notes.queries.js";

import { parseLeadId } from "../utils/parseId.js";

/**
 * GET /leads/:id/notes
 *
 * Returns all notes for a specific lead.
 */
export async function getByLeadId(req, res, next) {
  try {
    const leadId = parseLeadId(req.params.id);

    const notes = await getNotesByLeadId(leadId);

    res.json({
      data: notes,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /leads/:id/notes
 *
 * Creates a note for a specific lead.
 */
export async function create(req, res, next) {
  try {
    const leadId = parseLeadId(req.params.id);
    const { content } = req.body;

    if (typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ err: "Note content is required" });
    }

    const result = await createNote(leadId, content.trim());

    res.status(201).json({
      data: {
        id: result.id,
        lead_id: leadId,
        content: content.trim(),
      },
    });
  } catch (err) {
    next(err);
  }
}
