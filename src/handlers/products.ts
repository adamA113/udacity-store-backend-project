import express from 'express';
import { ProductModel } from '../models/product';

const productTable = new ProductModel();

export default class ProductsController {
    async getAllProducts(_req: express.Request, res: express.Response) {
        try {
            const products = await productTable.getAllProducts();
            return res.status(200).json(products);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async getProductById(req: express.Request, res: express.Response) {
        try {
            const product = await productTable.getProductById(parseInt(req.params.id));

            if (product) {
                return res.status(200).json(product);
            } else {
                return res.status(404).json({
                    error: `Couldn't find product with id ${req.params.id}`
                })
            }
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async createNewProduct(req: express.Request, res: express.Response) {
        try {
            const { name, price, category } = req.body;

            if (!name) {
                return res.status(400).json({
                    error: 'Product name is required',
                });
            } else if (!price) {
                return res.status(400).json({
                    error: 'Product price is required',
                });
            }

            const product = await productTable.createNewProduct({
                name,
                price: parseFloat(price),
                category
            });
            return res.status(201).json({
                product,
                message: "Product has been created successfully!",
            });
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async updateProduct(req: express.Request, res: express.Response) {
        try {
            const { name, price, category } = req.body;

            if (!name) {
                return res.status(400).json({
                    error: 'Product name is required',
                })
            }

            const product = await productTable.updateProduct({
                id: parseInt(req.params.id),
                name,
                price: parseFloat(price),
                category
            });
            
            return res.status(201).json(product);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async deleteProduct(req: express.Request, res: express.Response) {
        try {
            await productTable.deleteProduct(parseInt(req.params.id));
            return res.status(200).json({ message: `Product with id ${req.params.id} has been deleted successfully` });
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}