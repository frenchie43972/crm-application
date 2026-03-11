import db from '../db/database.js';
import {
  getAllLeads,
  getLeadById,
  createLead,
  deleteLead,
  updateLeadById,
} from '../db/queries/leads.queries.js';

import { parseLeadId } from '../utils/parseId.js';
import { parsePagination } from '../utils/parsePagination.js';
import { parseSearch } from '../utils/parseSearch.js';

/**
 * Allowed status values for tasks.
 *
 * Instead of accepting arbitrary strings, we restrict the values
 * to a predefined set. This prevents inconsistent data such as:
 *
 *   "new", "New", "won", etc.
 *
 * Using a constant also keeps validation logic centralized and reusable.
 */
const ALLOWED_STATUS_VALUES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
];

/**
 * GET /leads
 *
 * Returns a paginated list of leads.
 *
 * Flow:
 * 1. Parse and validate query parameters
 * 2. Call the database query function
 * 3. Return structured JSON
 */
export async function getAll(req, res, next) {
  try {
    // Extract validated pagination values
    const { limit, offset } = parsePagination(req.query);

    // Extract search value string
    const search = parseSearch(req.query);

    // Calls the database query layer
    const result = await getAllLeads(limit, offset, search);

    /**
     * Response structure includes:
     * - data: lead rows
     * - total: total number of rows matching query
     * - limit/offset: pagination metadata
     */
    res.json({
      data: result.rows,
      total: result.total,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
}
