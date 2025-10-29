import { ProductModel } from '../../models/product';
// @ts-ignore
import client from "../../database";

const store = new ProductModel();

describe('Product Model', () => {
    let productId: number;

    beforeEach(async () => {
        const result = await store.createNewProduct({
            name: 'Test product',
            price: 66.43,
            category: 'Test category',
        });
        productId = result.id as number;

        expect(result).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                name: jasmine.any(String),
                price: jasmine.any(Number),
                category: jasmine.any(String),
            })
        );
    })

    it('should update a specific product', async () => {
        const result = await store.updateProduct({
            id: productId,
            name: 'Test product 2',
            price: 76.54,
            category: 'New category',
        });
        expect(result).toEqual({
            id: jasmine.any(Number),
            name: jasmine.any(String),
            price: jasmine.any(Number),
            category: jasmine.any(String),
        });
    })

    it('should return a list of products', async () => {
        const result = await store.getAllProducts();
        expect(Array.isArray(result)).toBeTrue();
    })

    it('should return a specific  product', async () => {
        const result = await store.getProductById(Number(productId));
        expect(result).toEqual({
            id: jasmine.any(Number),
            name: jasmine.any(String),
            price: jasmine.any(Number),
            category: jasmine.any(String),
        });
    })

    it('should delete a specific product', async () => {
        await store.deleteProduct(productId);
        const product = await store.getProductById(Number(productId));

        expect(product).toBeUndefined();
    })

    afterEach(async () => {
        // @ts-ignore
        const conn = await client.connect();
        const query = `DELETE FROM products WHERE id=($1)`;
        await conn.query(query, [productId]);
        conn.release();
    });
})