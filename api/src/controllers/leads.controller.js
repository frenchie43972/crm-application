import { isValidPhoneNumber } from "libphonenumber-js";
import {
  getAllLeads,
  getLeadById,
  createLead,
  deleteLead,
  updateLeadById,
} from "../db/queries/leads.queries.js";

import { parseLeadId } from "../utils/parseId.js";
import { parsePagination } from "../utils/parsePagination.js";
import { parseSearch } from "../utils/parseSearch.js";

/**
 * Allowed status values for leads.
 *
 * Instead of accepting arbitrary strings, we restrict the values
 * to a predefined set. This prevents inconsistent data such as:
 *
 *   "new", "New", "won", etc.
 *
 * Using a constant also keeps validation logic centralized and reusable.
 */
const ALLOWED_STATUS_VALUES = new Set([
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
]);

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

/**
 * GET /leads/:id
 *
 * Returns a single lead by ID.
 */
export async function getById(req, res, next) {
  try {
    // Validate and parse a lead ID from a route param
    const id = parseLeadId(req.params.id);
    const lead = await getLeadById(id);

    // If no row was return then lead does not exist
    if (!lead) {
      return res.status(404).json({ err: "Lead not found" });
    }

    res.json({ data: lead });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /leads
 *
 * Creates a new lead.
 *
 * Example request body:
 * {
 *  "first_name": "Mia",
    "last_name": "Hernandez",
    "email": "mia.hernandez@hernandeztech.com",
    "phone": "+1-555-3112",
    "company": "Hernandez Tech",
    "status": "Negotiation",
 * }
*/
export async function create(req, res, next) {
  try {
    const { first_name, last_name, email, phone, company, status } = req.body;

    const requiredFields = ["first_name", "last_name", "email", "phone"];

    /**
     * Input validation.
     *
     * - Checks for empty strings
     * - Ensures valid email addressing
     * - Verifies lead status categories
     * - isValidPhoneNumber ensures legit phone numbers
     */
    for (const field of requiredFields) {
      if (
        typeof req.body[field] !== "string" ||
        req.body[field].trim() === ""
      ) {
        return res.status(400).json({ err: `${field} is required` });
      }
    }

    if (!email.includes("@")) {
      return res.status(400).json({ err: "Invalid email address" });
    }

    if (typeof status !== "string" || !ALLOWED_STATUS_VALUES.has(status)) {
      return res.status(400).json({ err: "Invalid lead status" });
    }

    if (!isValidPhoneNumber(phone)) {
      return res
        .status(400)
        .json({ err: "Invalid phone number or phone number format" });
    }

    /**
     * Normalize payload before sending to database.
     *
     * Example:
     * - Trim whitespace from inputs
     */
    const payload = {
      first_name: first_name !== undefined ? first_name.trim() : undefined,
      last_name: last_name !== undefined ? last_name.trim() : undefined,
      email: email !== undefined ? email.trim() : undefined,
      phone: phone !== undefined ? phone.trim() : undefined,
      company: typeof company === "string" ? company.trim() : "",
      status,
    };

    const result = await createLead(payload);

    res.status(201).json({
      data: {
        id: result.id,
        ...payload,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /leads/:id
 *
 * Deletes a lead by ID.
 */
export async function deleteById(req, res, next) {
  try {
    const id = parseLeadId(req.params.id);
    const result = await deleteLead(id);

    /**
     *
     * If changes === 0:
     * - No row matched the ID
     * - The resource does not exist
     */
    if (result.changes === 0) {
      return res.status(404).json({ err: "Lead not found" });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /leads/:id
 *
 * Updates an existing lead.
 */
export async function updateById(req, res, next) {
  try {
    const id = parseLeadId(req.params.id);
    const { first_name, last_name, email, phone, company, status } = req.body;

    // Input validations for editing
    if (
      first_name === undefined &&
      last_name === undefined &&
      email === undefined &&
      phone === undefined &&
      company === undefined &&
      status === undefined
    ) {
      return res.status(400).json({ err: "No fields provided for update" });
    }

    if (first_name !== undefined && first_name.trim() === "") {
      return res.status(400).json({ err: "first_name cannot be empty" });
    }

    if (email !== undefined && !email.includes("@")) {
      return res.status(400).json({ err: "Invalid email address" });
    }

    if (status !== undefined && !ALLOWED_STATUS_VALUES.has(status)) {
      return res.status(400).json({ err: "Invalid lead status" });
    }

    if (phone !== undefined && !isValidPhoneNumber(phone)) {
      return res
        .status(400)
        .json({ err: "Invalid phone number or phone number format" });
    }

    const payload = {
      first_name: first_name !== undefined ? first_name.trim() : undefined,
      last_name: last_name !== undefined ? last_name.trim() : undefined,
      email: email !== undefined ? email.trim() : undefined,
      phone: phone !== undefined ? phone.trim() : undefined,
      company: typeof company === "string" ? company.trim() : "",
      status,
    };

    const result = await updateLeadById(id, payload);

    if (result.changes === 0) {
      return res.status(404).json({ err: "Lead not found" });
    }

    res.json({
      data: {
        id,
        ...payload,
      },
    });
  } catch (err) {
    next(err);
  }
}
