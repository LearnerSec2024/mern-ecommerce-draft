import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(validateObjectId('id'), getProductById)
  .put(protect, admin, validateObjectId('id'), updateProduct)
  .delete(protect, admin, validateObjectId('id'), deleteProduct);

export default router;
