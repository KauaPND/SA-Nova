import pool from '../config/db.js';

export class OrderService {
     async createOrder(userId, orderData) {
          const { shippingAddress, paymentMethod } = orderData;
          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               // Busca carrinho ativo e calcula total
               const cartResult = await client.query(
                    `SELECT c.id, SUM(ci.quantity * ci.price_at_time) as total_amount
         FROM carts c
         JOIN cart_items ci ON c.id = ci.cart_id
         WHERE c.user_id = $1 AND c.status = 'active'
         GROUP BY c.id`,
                    [userId]
               );

               if (cartResult.rows.length === 0) {
                    throw { status: 400, message: 'Carrinho vazio' };
               }

               const cartId = cartResult.rows[0].id;
               const totalAmount = cartResult.rows[0].total_amount;

               // Cria pedido
               const orderResult = await client.query(
                    `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING *`,
                    [userId, totalAmount, shippingAddress, paymentMethod]
               );

               // Move itens do carrinho para o pedido
               await client.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
         SELECT $1, ci.product_id, ci.quantity, ci.price_at_time
         FROM cart_items ci
         WHERE ci.cart_id = $2`,
                    [orderResult.rows[0].id, cartId]
               );

               // Atualiza status do carrinho
               await client.query(
                    `UPDATE carts SET status = 'completed'
         WHERE id = $1`,
                    [cartId]
               );

               await client.query('COMMIT');
               return orderResult.rows[0];
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }

     async getUserOrders(userId) {
          const result = await pool.query(
               `SELECT o.*, 
         json_agg(json_build_object(
           'id', oi.id,
           'product_id', oi.product_id,
           'quantity', oi.quantity,
           'price_at_time', oi.price_at_time
         )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
               [userId]
          );
          return result.rows;
     }

     async getOrderById(orderId, userId) {
          const result = await pool.query(
               `SELECT o.*, 
         json_agg(json_build_object(
           'id', oi.id,
           'product_id', oi.product_id,
           'quantity', oi.quantity,
           'price_at_time', oi.price_at_time
         )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
               [orderId, userId]
          );

          if (result.rows.length === 0) {
               throw { status: 404, message: 'Pedido não encontrado' };
          }

          return result.rows[0];
     }
}

const orderService = new OrderService();
export default orderService;