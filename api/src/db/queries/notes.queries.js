import db from "../database.js";

/**
 * Fetch all notes belonging to a specific lead.
 *
 * Notes are ordered newest first.
 */
export function getNotesByLeadId(leadId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id,
        lead_id,
        content,
        created_on
      FROM notes
      WHERE lead_id = ?
      ORDER BY created_on DESC
    `;

    db.all(sql, [leadId], (err, rows) => {
      if (err) return reject(err);

      resolve(rows);
    });
  });
}

/**
 * Create a note belonging to a specific lead.
 */
export function createNote(leadId, content) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO notes (lead_id, content)
      VALUES (?, ?)
    `;

    db.run(sql, [leadId, content], function (err) {
      if (err) return reject(err);

      resolve({
        id: this.lastID,
      });
    });
  });
}
