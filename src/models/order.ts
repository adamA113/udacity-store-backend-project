// @ts-ignore
import client from '../database';
import { Order, ProductToOrder } from '../helpers/types';

export class OrderModel {
    async getAllOrders(): Promise<Order[]> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'SELECT * FROM orders';
            const result = await connection.query(query);
            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all orders. Error: ${err}`);
        }
    }

    async getOrderById(id: number): Promise<Order> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'SELECT * FROM orders WHERE id=($1)';
            const result = await connection.query(query, [id]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async createNewOrder(order: Order): Promise<Order> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const result = await connection.query(query, [
                order.status,
                order.user_id
            ]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`);
        }
    }

    async updateOrder(order: Order): Promise<Order> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = `UPDATE orders SET status = $2,  user_id= $3 WHERE id = $1 RETURNING *`;
            const result = await connection.query(query, [
                order.id,
                order.status,
                order.user_id
            ]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update order with id ${order.id}. Error: ${err}`);
        }
    }

    async deleteOrder(id: number): Promise<Order> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const query = 'DELETE FROM products WHERE id=($1)';
            const result = await conn.query(query, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }

    async currentOrderByUser(user_id: number) {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const query = "SELECT * FROM orders WHERE user_id = ($1)";
            const result = await conn.query(query, [user_id]);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders for user with id  ${user_id}. Error: ${err}`)
        }
    }

    async addProductToOrder(poduct: ProductToOrder): Promise<ProductToOrder> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await connection.query(query, [
                poduct.order_id,
                poduct.product_id,
                poduct.quantity,
            ]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product. Error: ${err}`);
        }
    }
}