import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
});

// Listener para logs de erros do pool
pool.on('error', (err) => {
     console.error('Erro inesperado no pool do PostgreSQL', err);
});

export default pool;