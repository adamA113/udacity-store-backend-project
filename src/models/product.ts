// @ts-ignore
import client from '../database';
import { Product } from '../helpers/types';

export class ProductModel {
    async getAllProducts(): Promise<Product[]> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'SELECT * FROM products';
            const result = await connection.query(query);
            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all products. Error: ${err}`)
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find the product with id ${id}. Error: ${err}`);
        }
    }

    async createNewProduct(product: Product): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await connection.query(query, [
                product.name,
                product.price,
                product.category,
            ])
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new product. Error: ${err}`);
        }
    }

    async updateProduct(product: Product): Promise<Product> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = `UPDATE products SET name = $2, price = $3, category = $4 WHERE id = $1 RETURNING *`;
            const result = await connection.query(query, [
                product.id,
                product.name,
                product.price,
                product.category,
            ])
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product with id ${product.id}. Error: ${err}`);
        }
    }

    async deleteProduct(id: number): Promise<Product> {
        try {
            // @ts-ignore
            const conn = await client.connect();
            const query = 'DELETE FROM products WHERE id=($1) RETURNING *'
            const result = await conn.query(query, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete product with id  ${id}. Error: ${err}`);
        }
    }
}