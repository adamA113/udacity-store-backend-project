import { ProductModel } from '../../models/product';

const store = new ProductModel();

describe('Product Model', () => {
    it('should create a product', async () => {
        const result = await store.createNewProduct({
            name: 'Test product',
            price: 66.43,
            category: 'Test category',
        });
        expect(result).toEqual({
            id: 1,
            name: 'Test product',
            price: 66.43,
            category: 'Test category',
        });
    })

    it('should update a specific product', async () => {
        const result = await store.updateProduct({
            id: 1,
            name: 'Test product 2',
            price: 76.54,
            category: 'New category',
        });
        expect(result).toEqual({
            id: 1,
            name: 'Test product 2',
            price: 76.54,
            category: 'New category',
        });
    })

    it('should return a list of products', async () => {
        const result = await store.getAllProducts();
        expect(result).toEqual([
            {
                id: 1,
                name: 'Test product 2',
                price: 88.65,
                category: 'New category',
            },
        ]);
    })

    it('should return a specific  product', async () => {
        const result = await store.getProductById(1);
        expect(result).toEqual({
            id: 1,
            name: 'Test product 2',
            price: 88.65,
            category: 'New category',
        });
    })

    it('should delete a specific product', async () => {
        await store.deleteProduct(1);
        const result = await store.getAllProducts();

        expect(result).toEqual([]);
    })
})