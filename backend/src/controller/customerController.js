const pool = require('../db');

// Histórico de clientes dinâmico
exports.getCustomerHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ch.id, ch.details, ch.created_at, u.email 
      FROM customer_history ch
      INNER JOIN users u ON ch.user_id = u.id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico de clientes' });
  }
};

// Adicionar histórico para um cliente
exports.addCustomerHistory = async (req, res) => {
  const { userId, details } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO customer_history (user_id, details) VALUES ($1, $2) RETURNING *`,
      [userId, details]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao adicionar histórico' });
  }
};
