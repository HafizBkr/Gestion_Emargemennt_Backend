const pool = require('../config/database'); // Assurez-vous que votre pool DB est configuré correctement

class AnneeScolaireModel {
  static async getAll() {
    const query = 'SELECT * FROM annees_scolaires ORDER BY start_date DESC;';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getActive() {
    const query = 'SELECT * FROM annees_scolaires WHERE is_active = TRUE LIMIT 1;';
    const result = await pool.query(query);
    return result.rows[0]; // Retourne l'année scolaire active
  }

  static async create({ start_date, end_date, is_active }) {
    const query = `
      INSERT INTO annees_scolaires (start_date, end_date, is_active)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await pool.query(query, [start_date, end_date, is_active]);
    return result.rows[0];
  }

  static async update(id, { start_date, end_date, is_active }) {
    const query = `
      UPDATE annees_scolaires
      SET start_date = $1, end_date = $2, is_active = $3
      WHERE id = $4 RETURNING *;
    `;
    const result = await pool.query(query, [start_date, end_date, is_active, id]);
    return result.rows[0];
  }

  static async deactivate(id) {
    const query = 'UPDATE annees_scolaires SET is_active = FALSE WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = AnneeScolaireModel;
