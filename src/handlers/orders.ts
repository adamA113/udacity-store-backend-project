import express from 'express';
import { OrderModel } from '../models/order';

const ordersTable = new OrderModel()

export default class OrdersController {
    async getAllOrders(_req: express.Request, res: express.Response) {
        try {
            const orders = await ordersTable.getAllOrders();
            return res.status(200).json(orders);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async getOrderById(req: express.Request, res: express.Response) {
        try {
            const order = await ordersTable.getOrderById(parseInt(req.params.id));

            if (order?.id) {
                return res.status(200).json(order);
            } else {
                return res.status(404).json({
                    error: `Couldn't find order with id ${req.params.id}`
                });
            }
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async currentOrderByUser(req: express.Request, res: express.Response) {
        try {
            const { user_id } = req.params;
            const currentOrder = await ordersTable.currentOrderByUser(parseInt(user_id));
            
            if (currentOrder) {
                return res.status(200).json(currentOrder);
            } else {
                return res.status(200).json({});
            } 
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async createNewOrder(req: express.Request, res: express.Response) {
        try {
            const { user_id, status } = req.body;

            if (!user_id) {
                return res.status(400).json({
                    error: 'User ID is required',
                });
            } else if (!status) {
                return res.status(400).json({
                    error: 'Order status is required',
                });
            }

            const order = await ordersTable.createNewOrder({
                status: status,
                user_id: parseInt(user_id)
            });

            return res.status(201).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async addProductToOrder(req: express.Request, res: express.Response) {
        try {
            const { order_id, product_id, quantity } = req.body;

            if (!order_id || !product_id || !quantity) {
                return res.status(400).json({
                    error: 'Missing one or more required parameters',
                })
            }

            const product = await ordersTable.addProductToOrder({
                order_id: parseInt(order_id),
                product_id: parseInt(product_id),
                quantity: parseInt(quantity),
            })

            return res.status(200).json(product);
        } catch (e) { 
            return res.status(500).json(e);
        }
    }

    async updateOrder(req: express.Request, res: express.Response) {
        try {
            const { user_id, status } = req.body
            const id = req.params.id

            if (!id || !user_id || !status) {
                return res.status(400).json({
                    error: 'Missing one or more required parameters',
                })
            }

            const order = await ordersTable.updateOrder({
                id: parseInt(req.params.id),
                user_id: parseInt(req.params.user_id),
                status: status,
            })
            return res.status(201).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async deleteOrder(req: express.Request, res: express.Response) {
        try {
            await ordersTable.deleteOrder(parseInt(req.params.id))
            return res.status(200).json({ message: `Order with id ${req.params.id} has been deleted successfully` });
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}