import express from 'express';
import OrdersController from '../../handlers/orders';
import { auth } from '../../middleware/index';

const ordersRouter = express.Router();
const ordersController = new OrdersController();

ordersRouter.get('/', auth, ordersController.getAllOrders);
ordersRouter.get('/:id', auth, ordersController.getOrderById);
ordersRouter.get('/current/:user_id', auth, ordersController.currentOrderByUser);
ordersRouter.post('/create', auth, ordersController.createNewOrder);
ordersRouter.post('/add-product/:id', auth, ordersController.addProductToOrder);
ordersRouter.put('/:id', auth, ordersController.updateOrder);
ordersRouter.delete('/:id', auth, ordersController.deleteOrder);

export default ordersRouter;