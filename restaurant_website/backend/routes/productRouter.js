import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', createProduct);
productRouter.get('/', getAllProducts);
productRouter.get('/:productId', getProductById);
productRouter.put('/:productId', updateProduct);
productRouter.delete('/:productId', deleteProduct);

export default productRouter;
