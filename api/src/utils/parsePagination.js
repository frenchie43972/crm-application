/**
 * Parses pagination values from query parameters.
 *
 * limit  → how many records to return
 * offset → how many records to skip
 *
 * This function:
 * - Converts values to numbers
 * - Applies defaults
 * - Enforces safe bounds
 *
 * Pagination prevents returning the entire dataset at once,
 * which improves performance and reduces network load.
 */

// Upper limit for pagination to prevent large queries
const MAX_LIMIT = 50;

export function parsePagination(query) {
  /**
   * Number(query.limit) may return NaN if the value is invalid.
   * `|| 20` provides a default.
   *
   * Math.max ensures the value is at least 1.
   * Math.min ensures the value does not exceed MAX_LIMIT.
   */
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), MAX_LIMIT);

  /**
   * Offset must never be negative.
   * Default is 0 (start at the beginning).
   */
  const offset = Math.max(Number(query.offset) || 0, 0);

  return { limit, offset };
}
