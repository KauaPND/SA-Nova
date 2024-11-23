import bcrypt from 'bcrypt';
import pool from './db.js';

const createTables = async () => {
     try {
          // Conecta ao banco
          const client = await pool.connect();

          // Cria tipos enumerados
          await client.query(`
         DO $$ BEGIN
           CREATE TYPE user_role AS ENUM ('user', 'admin');
         EXCEPTION
           WHEN duplicate_object THEN null;
         END $$;
       `);

          // Cria tabela de usuários
          await client.query(`
         CREATE TABLE IF NOT EXISTS users (
           id SERIAL PRIMARY KEY,
           email VARCHAR(255) UNIQUE NOT NULL,
           password VARCHAR(255) NOT NULL,
           cpf VARCHAR(14) UNIQUE,
           cep VARCHAR(9),
           role user_role DEFAULT 'user',
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria tabela de produtos
          await client.query(`
         CREATE TABLE IF NOT EXISTS products (
           id SERIAL PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           price DECIMAL(10,2) NOT NULL,
           image_url TEXT NOT NULL,
           stock_quantity INTEGER DEFAULT 0,
           description TEXT,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria tabela de carrinhos
          await client.query(`
         CREATE TABLE IF NOT EXISTS carts (
           id SERIAL PRIMARY KEY,
           user_id INTEGER REFERENCES users(id),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           status VARCHAR(20) DEFAULT 'active'
         );
       `);

          // Cria tabela de itens do carrinho
          await client.query(`
         CREATE TABLE IF NOT EXISTS cart_items (
           id SERIAL PRIMARY KEY,
           cart_id INTEGER REFERENCES carts(id),
           product_id INTEGER REFERENCES products(id),
           quantity INTEGER NOT NULL,
           price_at_time DECIMAL(10,2) NOT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria tabela de pedidos
          await client.query(`
         CREATE TABLE IF NOT EXISTS orders (
           id SERIAL PRIMARY KEY,
           user_id INTEGER REFERENCES users(id),
           total_amount DECIMAL(10,2) NOT NULL,
           status VARCHAR(20) DEFAULT 'pending',
           shipping_address TEXT,
           payment_method VARCHAR(50),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria tabela de itens do pedido
          await client.query(`
         CREATE TABLE IF NOT EXISTS order_items (
           id SERIAL PRIMARY KEY,
           order_id INTEGER REFERENCES orders(id),
           product_id INTEGER REFERENCES products(id),
           quantity INTEGER NOT NULL,
           price_at_time DECIMAL(10,2) NOT NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria tabela de histórico do cliente
          await client.query(`
         CREATE TABLE IF NOT EXISTS customer_history (
           id SERIAL PRIMARY KEY,
           user_id INTEGER REFERENCES users(id),
           action_type VARCHAR(50) NOT NULL,
           details TEXT,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
       `);

          // Cria função para atualizar timestamp
          await client.query(`
         CREATE OR REPLACE FUNCTION update_updated_at_column()
         RETURNS TRIGGER AS $$
         BEGIN
           NEW.updated_at = CURRENT_TIMESTAMP;
           RETURN NEW;
         END;
         $$ language 'plpgsql';
       `);

          // Cria triggers para atualizar timestamp
          const tablesWithTimestamp = ['users', 'products', 'orders'];
          for (const table of tablesWithTimestamp) {
               await client.query(`
           DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
           CREATE TRIGGER update_${table}_updated_at
             BEFORE UPDATE ON ${table}
             FOR EACH ROW
             EXECUTE FUNCTION update_updated_at_column();
         `);
          }

          // Insere um usuário admin padrão
          const adminPassword = await bcrypt.hash('admin123', 10);

          await client.query(`
         INSERT INTO users (email, password, role)
         VALUES ('admin@lostplushy.com', $1, 'admin')
         ON CONFLICT (email) DO NOTHING;
       `, [adminPassword]);

          console.log('✅ Todas as tabelas foram criadas com sucesso!');
          console.log('📧 Usuário admin criado:');
          console.log('Email: admin@lostplushy.com');
          console.log('Senha: admin123');



     } catch (error) {
          console.error('❌ Erro ao criar as tabelas:', error);
          process.exit(1);
     }
};



export default createTables;