import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import pool from '../config/db';

class AuthService {
     async register(userData) {
          const { email, password, cpf, cep } = userData;

          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               // Verifica se usuário já existe
               const userExists = await client.query(
                    'SELECT id FROM users WHERE email = $1',
                    [email]
               );

               if (userExists.rows.length > 0) {
                    throw { status: 400, message: 'Email já cadastrado' };
               }

               // Hash da senha
               const hashedPassword = await hash(password, 10);

               // Insere o usuário
               const result = await client.query(
                    `INSERT INTO users (email, password, cpf, cep)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, role`,
                    [email, hashedPassword, cpf, cep]
               );

               await client.query('COMMIT');
               return result.rows[0];
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }

     async login(credentials) {
          const { email, password } = credentials;

          const result = await pool.query(
               'SELECT * FROM users WHERE email = $1',
               [email]
          );

          if (result.rows.length === 0) {
               throw { status: 401, message: 'Credenciais inválidas' };
          }

          const user = result.rows[0];
          const validPassword = await compare(password, user.password);

          if (!validPassword) {
               throw { status: 401, message: 'Credenciais inválidas' };
          }

          const token = sign(
               { id: user.id, role: user.role },
               process.env.JWT_SECRET,
               { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return {
               token,
               user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
               }
          };
     }
}

export default new AuthService();