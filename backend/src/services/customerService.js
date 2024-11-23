// src/services/customerService.js
import pool from '../config/db.js';

class CustomerService {
     async getAllCustomers() {
          const result = await pool.query(`
      SELECT 
        u.id, 
        u.email, 
        u.cpf, 
        u.cep, 
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.total_amount) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

          return result.rows;
     }

     async getCustomerDetails(customerId) {
          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               // Busca informações do cliente
               const customerResult = await client.query(`
        SELECT id, email, cpf, cep, created_at
        FROM users
        WHERE id = $1 AND role = 'user'
      `, [customerId]);

               if (customerResult.rows.length === 0) {
                    throw { status: 404, message: 'Cliente não encontrado' };
               }

               // Busca histórico de pedidos
               const ordersResult = await client.query(`
        SELECT 
          o.id,
          o.total_amount,
          o.status,
          o.created_at,
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price_at_time', oi.price_at_time,
              'name', p.name,
              'image_url', p.image_url
            )
          ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, [customerId]);

               // Busca estatísticas do cliente
               const statsResult = await client.query(`
        SELECT 
          COUNT(DISTINCT o.id) as total_orders,
          SUM(o.total_amount) as total_spent,
          MAX(o.created_at) as last_purchase
        FROM orders o
        WHERE o.user_id = $1
      `, [customerId]);

               await client.query('COMMIT');

               return {
                    ...customerResult.rows[0],
                    orders: ordersResult.rows,
                    stats: statsResult.rows[0]
               };
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }

     async getCustomerAnalytics(customerId) {
          const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', o.created_at) as month,
        COUNT(DISTINCT o.id) as orders_count,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as average_order_value
      FROM orders o
      WHERE o.user_id = $1
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month DESC
      LIMIT 12
    `, [customerId]);

          return result.rows;
     }
}

export default new CustomerService();