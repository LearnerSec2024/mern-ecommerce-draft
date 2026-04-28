import express from 'express';
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getCart);
router.post('/add', addToCart);
router.put('/update/:productId', validateObjectId('productId'), updateCartItem);
router.delete('/remove/:productId', validateObjectId('productId'), removeCartItem);
router.delete('/clear', clearCart);

export default router;
