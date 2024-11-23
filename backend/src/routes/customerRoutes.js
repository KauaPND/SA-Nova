// src/routes/customerRoutes.js
import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import {
     getAllCustomers,
     getCustomerDetails,
     getCustomerAnalytics
} from '../controller/customerController.js';

const router = Router();

// Todas as rotas requerem autenticação e permissão de admin
router.use(authenticateToken, isAdmin);

// Listar todos os clientes
router.get('/', getAllCustomers);

// Obter detalhes de um cliente específico
router.get('/:id', getCustomerDetails);

// Obter análises de um cliente específico
router.get('/:id/analytics', getCustomerAnalytics);

export default router;