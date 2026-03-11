/**
 * Parses and validates an ID from route parameters.
 *
 * 1. Converts it to a number
 * 2. Ensures it is an integer
 * 3. Ensures it is greater than zero
 *
 * If validation fails, an Error is thrown with a status code.
 *
 * Concept: Centralized validation helper.
 *
 * Throwing errors allows Express error middleware to handle
 * responses consistently instead of repeating error responses
 * in every controller.
 */

function parsePositiveInteger(raw, label) {
  const value = Number(raw);

  if (!Number.isInteger(value) || value <= 0) {
    const err = new Error(`Invalid ${label} ID`);
    err.status = 400;
    throw err;
  }
  return value;
}

export function parseLeadId(raw) {
  return parsePositiveInteger(raw, 'lead');
}

export function parseNoteId(raw) {
  return parsePositiveInteger(raw, 'note');
}
