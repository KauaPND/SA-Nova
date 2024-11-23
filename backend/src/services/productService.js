import pool from '../config/db.js';

class ProductService {
     async getAllProducts() {
          const result = await pool.query(
               'SELECT * FROM products ORDER BY created_at DESC'
          );
          return result.rows;
     }

     async getProductById(id) {
          const result = await pool.query(
               'SELECT * FROM products WHERE id = $1',
               [id]
          );

          if (result.rows.length === 0) {
               throw { status: 404, message: 'Produto não encontrado' };
          }

          return result.rows[0];
     }

     async createProduct(productData) {
          const { name, price, imageUrl, description, stockQuantity } = productData;

          const result = await pool.query(
               `INSERT INTO products (name, price, image_url, description, stock_quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
               [name, price, imageUrl, description, stockQuantity || 0]
          );

          return result.rows[0];
     }

     async updateProduct(id, productData) {
          const { name, price, imageUrl, description, stockQuantity } = productData;

          const result = await pool.query(
               `UPDATE products 
       SET name = $1, price = $2, image_url = $3, description = $4, 
           stock_quantity = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
               [name, price, imageUrl, description, stockQuantity, id]
          );

          if (result.rows.length === 0) {
               throw { status: 404, message: 'Produto não encontrado' };
          }

          return result.rows[0];
     }

     async deleteProduct(id) {
          const result = await pool.query(
               'DELETE FROM products WHERE id = $1 RETURNING *',
               [id]
          );

          if (result.rows.length === 0) {
               throw { status: 404, message: 'Produto não encontrado' };
          }

          return result.rows[0];
     }
}

export default new ProductService();