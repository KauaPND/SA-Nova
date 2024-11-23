import pool from '../config/db.js';

class CartService {
     async getCart(userId) {
          const cartResult = await pool.query(
               `SELECT c.id
       FROM carts c
       WHERE c.user_id = $1 AND c.status = 'active'`,
               [userId]
          );

          if (cartResult.rows.length === 0) {
               return { items: [] };
          }

          const itemsResult = await pool.query(
               `SELECT ci.*, p.name, p.image_url, p.price as current_price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
               [cartResult.rows[0].id]
          );

          return {
               id: cartResult.rows[0].id,
               items: itemsResult.rows,
               total: itemsResult.rows.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0)
          };
     }

     async addToCart(userId, productId, quantity) {
          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               // Verifica estoque
               const productResult = await client.query(
                    'SELECT price, stock_quantity FROM products WHERE id = $1',
                    [productId]
               );

               if (productResult.rows.length === 0) {
                    throw { status: 404, message: 'Produto não encontrado' };
               }

               if (productResult.rows[0].stock_quantity < quantity) {
                    throw { status: 400, message: 'Quantidade indisponível em estoque' };
               }

               // Busca ou cria carrinho
               let cartResult = await client.query(
                    `SELECT id FROM carts
         WHERE user_id = $1 AND status = 'active'`,
                    [userId]
               );

               let cartId;
               if (cartResult.rows.length === 0) {
                    const newCart = await client.query(
                         `INSERT INTO carts (user_id, status)
           VALUES ($1, 'active')
           RETURNING id`,
                         [userId]
                    );
                    cartId = newCart.rows[0].id;
               } else {
                    cartId = cartResult.rows[0].id;
               }

               // Verifica se item já existe no carrinho
               const existingItem = await client.query(
                    `SELECT id, quantity FROM cart_items
         WHERE cart_id = $1 AND product_id = $2`,
                    [cartId, productId]
               );

               if (existingItem.rows.length > 0) {
                    // Atualiza quantidade do item existente
                    await client.query(
                         `UPDATE cart_items 
           SET quantity = quantity + $1
           WHERE id = $2`,
                         [quantity, existingItem.rows[0].id]
                    );
               } else {
                    // Adiciona novo item
                    await client.query(
                         `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
           VALUES ($1, $2, $3, $4)`,
                         [cartId, productId, quantity, productResult.rows[0].price]
                    );
               }

               await client.query('COMMIT');
               return await this.getCart(userId);
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }

     async updateCartItem(userId, itemId, quantity) {
          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               // Verifica se item pertence ao carrinho do usuário
               const itemResult = await client.query(
                    `SELECT ci.*, p.stock_quantity
         FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         JOIN products p ON ci.product_id = p.id
         WHERE ci.id = $1 AND c.user_id = $2 AND c.status = 'active'`,
                    [itemId, userId]
               );

               if (itemResult.rows.length === 0) {
                    throw { status: 404, message: 'Item não encontrado' };
               }

               if (itemResult.rows[0].stock_quantity < quantity) {
                    throw { status: 400, message: 'Quantidade indisponível em estoque' };
               }

               await client.query(
                    'UPDATE cart_items SET quantity = $1 WHERE id = $2',
                    [quantity, itemId]
               );

               await client.query('COMMIT');
               return await this.getCart(userId);
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }

     async removeFromCart(userId, itemId) {
          const client = await pool.connect();

          try {
               await client.query('BEGIN');

               const result = await client.query(
                    `DELETE FROM cart_items ci
         USING carts c
         WHERE ci.id = $1 AND ci.cart_id = c.id 
         AND c.user_id = $2 AND c.status = 'active'
         RETURNING ci.*`,
                    [itemId, userId]
               );

               if (result.rows.length === 0) {
                    throw { status: 404, message: 'Item não encontrado' };
               }

               await client.query('COMMIT');
               return await this.getCart(userId);
          } catch (error) {
               await client.query('ROLLBACK');
               throw error;
          } finally {
               client.release();
          }
     }
}

export default new CartService();