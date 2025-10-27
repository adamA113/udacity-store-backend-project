import express from 'express';
import usersRouter from '../routes/apis/users';
import productsRouter from '../routes/apis/products';
import ordersRouter from '../routes/apis/orders';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);

export default router;