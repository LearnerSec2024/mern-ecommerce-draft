import express from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/', admin, getAllOrders);
router.get('/:id', validateObjectId('id'), getOrderById);
router.put('/:id/status', admin, validateObjectId('id'), updateOrderStatus);

export default router;
