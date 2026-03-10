import db from "../database.js";

export function getAllLeads(limit, offset, search) {
  return new Promise((resolve, reject) => {
    // Holds SQL conditionals (LIKE, WHERE, etc)
    const conditions = [];

    /**
     * params stores values that replace SQL placeholders (?).
     *
     * Using placeholders prevents SQL injection and allows the
     * database driver to safely bind user input.
     */
    const params = [];

    /**
     * Optional search filter.
     *
     * %${search}% acts as a wildcard: %smith% matches "John Smith", etc.
     */
    if (search) {
      conditions.push(
        `(first_name LIKE ? OR last_name LIKE ? OR company LIKE ?)`,
      );

      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    /**
     * Constructs the WHERE clause dynamically.
     *
     * If conditions exist:
     *   WHERE condition1 AND condition2
     *
     * If no conditions exist:
     *   (empty string → no WHERE clause)
     */
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    /**
     * Main query used to fetch paginated rows.
     *
     * ORDER BY created_date DESC ensures newest tasks appear first.
     *
     * LIMIT and OFFSET implement pagination.
     */
    const dataSql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        company,
        status,
        created_on,
        updated_on
        FROM leads
      ${whereClause}
      ORDER BY created_date DESC
      LIMIT ? OFFSET ?
    `;

    /**
     * Separate query used to count total matching rows.
     *
     * Pagination APIs often return both:
     *   - the current page of results
     *   - the total number of records
     *
     * This allows clients (frontends) to render page numbers
     * or calculate how many pages exist.
     */
    const countSql = `
      SELECT COUNT(*) as total
      FROM leads
      ${whereClause}
    `;

    // Executes the count query to return a single row instead of the array
    db.get(countSql, params, (countErr, countRow) => {
      if (countErr) return reject(countErr);

      const total = countRow.total;

      /**
       * Executes the main data query.
       *
       */
      db.all(dataSql, [...params, limit, offset], (dataErr, rows) => {
        if (dataErr) return reject(dataErr);

        /**
         * The Promise resolves with both:
         * - rows  → actual data
         * - total → number of matching rows
         */
        resolve({
          rows,
          total,
        });
      });
    });
  });
}
