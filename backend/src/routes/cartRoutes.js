import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import cartService from '../services/cartService.js';
const router = Router();

// Obter carrinho do usuário
router.get('/', authenticateToken, async (req, res, next) => {
     try {
          const cart = await cartService.getCart(req.user.id);
          res.json(cart);
     } catch (error) {
          next(error);
     }
});

// Adicionar item ao carrinho
router.post('/add', authenticateToken, async (req, res, next) => {
     try {
          const { productId, quantity } = req.body;
          const cart = await cartService.addToCart(req.user.id, productId, quantity);
          res.status(201).json(cart);
     } catch (error) {
          next(error);
     }
});

// Atualizar quantidade de item no carrinho
router.put('/items/:itemId', authenticateToken, async (req, res, next) => {
     try {
          const { itemId } = req.params;
          const { quantity } = req.body;
          const cart = await cartService.updateCartItem(req.user.id, itemId, quantity);
          res.json(cart);
     } catch (error) {
          next(error);
     }
});

// Remover item do carrinho
router.delete('/items/:itemId', authenticateToken, async (req, res, next) => {
     try {
          const { itemId } = req.params;
          const cart = await cartService.removeFromCart(req.user.id, itemId);
          res.json(cart);
     } catch (error) {
          next(error);
     }
});

export default router;