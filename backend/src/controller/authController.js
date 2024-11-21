const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Registro de usuário
exports.register = async (req, res) => {
  const { email, password, cpf, cep } = req.body;

  if (!email || !password || !cpf || !cep) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, cpf, cep) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, role`,
      [email, hashedPassword, cpf, cep]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(400).json({ error: 'Erro ao registrar usuário. Verifique os dados enviados.' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login bem-sucedido!', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = req.user; // O usuário decodificado está no req.user
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
};
