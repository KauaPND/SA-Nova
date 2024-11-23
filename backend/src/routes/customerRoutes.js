import { Router } from 'express';
import { getCustomerHistory, addCustomerHistory } from '../controller/customerController';
const router = Router();

router.get('/', getCustomerHistory);
router.post('/', addCustomerHistory);

export default router;
