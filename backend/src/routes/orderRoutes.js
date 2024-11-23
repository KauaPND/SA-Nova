import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import orderService from '../services/orderService.js';

const router = express.Router();

// Criar pedido
router.post('/', authenticateToken, async (req, res, next) => {
     try {
          const order = await orderService.createOrder(req.user.id, req.body);
          res.status(201).json(order);
     } catch (error) {
          next(error);
     }
});

// Listar pedidos do usuário
router.get('/', authenticateToken, async (req, res, next) => {
     try {
          const orders = await orderService.getUserOrders(req.user.id);
          res.json(orders);
     } catch (error) {
          next(error);
     }
});

// Obter pedido específico
router.get('/:orderId', authenticateToken, async (req, res, next) => {
     try {
          const order = await orderService.getOrderById(req.params.orderId, req.user.id);
          res.json(order);
     } catch (error) {
          next(error);
     }
});

export default router;