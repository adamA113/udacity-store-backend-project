import express from 'express';;
import ProductsControllers from '../../handlers/products';
import { auth } from '../../middleware/index';

const productsRouter = express.Router();
const productsController = new ProductsControllers();

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:id', productsController.getProductById);
productsRouter.post('/create', auth, productsController.createNewProduct);
productsRouter.put('/:id', auth, productsController.updateProduct);
productsRouter.delete('/:id', auth, productsController.deleteProduct);

export default productsRouter;