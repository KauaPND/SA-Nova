import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import productService from '../services/productService.js';
const router = Router();

// Listar todos os produtos
router.get('/', authenticateToken, async (req, res, next) => {
     try {
          const products = await productService.getAllProducts();
          res.json(products);
     } catch (error) {
          next(error);
     }
});

// Obter produto específico
router.get('/:id', authenticateToken, async (req, res, next) => {
     try {
          const product = await productService.getProductById(req.params.id);
          res.json(product);
     } catch (error) {
          next(error);
     }
});

// Criar produto (admin)
router.post('/', authenticateToken, isAdmin, async (req, res, next) => {
     try {
          const product = await productService.createProduct(req.body);
          res.status(201).json(product);
     } catch (error) {
          next(error);
     }
});

// Atualizar produto (admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res, next) => {
     try {
          const product = await productService.updateProduct(req.params.id, req.body);
          res.json(product);
     } catch (error) {
          next(error);
     }
});

// Deletar produto (admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res, next) => {
     try {
          const product = await productService.deleteProduct(req.params.id);
          res.json(product);
     } catch (error) {
          next(error);
     }
});

export default router;