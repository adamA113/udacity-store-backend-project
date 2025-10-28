import { OrderModel } from '../../models/order';
import { UserModel } from '../../models/user';
import { ProductModel } from '../../models/product';

const orderStore = new OrderModel();
const userStore = new UserModel();
const productStore = new ProductModel();

describe('Order Model', () => {
    let userId: number;
    let productId: number;
    
    beforeAll(async () => {
        const user = await userStore.createNewUser({
            firstname: 'Order',
            lastname: 'TestUser',
            password: 'test123',
        });
        userId = user.id as number;

        const product = await productStore.createNewProduct({
            name: 'Order Product',
            price: 99.99,
            category: 'Order Category',
        });
        productId = product.id as number;
    });

    it('should create a new order', async () => {
        const result = await orderStore.createNewOrder({
            status: false,
            user_id: userId,
        });
        expect(result).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                status: false,
                user_id: userId,
            })
        );
    });

    it('should return a list of orders', async () => {
        const result = await orderStore.getAllOrders();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return a specific order', async () => {
        const orders = await orderStore.getAllOrders();
        const orderId = orders[0].id as number;
        const result = await orderStore.getOrderById(orderId);
        
        expect(result).toEqual(
            jasmine.objectContaining({
                id: orderId,
                user_id: userId,
            })
        );
    });

    it('should update a specific order', async () => {
        const orders = await orderStore.getAllOrders();
        const orderId = orders[0].id as number;

        const result = await orderStore.updateOrder({
            id: orderId,
            status: true,
            user_id: userId,
        });
        
        expect(result.status).toEqual(true);
    });

    it('should get current orders for a user', async () => {
        const result = await orderStore.currentOrderByUser(userId);
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0);
    });

    it('should add a product to an order', async () => {
        const orders = await orderStore.getAllOrders();
        const orderId = orders[0].id as number;

        const result = await orderStore.addProductToOrder({
            order_id: orderId,
            product_id: productId,
            quantity: 2,
        });
        
        expect(result).toEqual(
            jasmine.objectContaining({
                order_id: orderId,
                product_id: productId,
                quantity: 2,
            })
        );
    });

    it('should delete a specific order', async () => {
        const orders = await orderStore.getAllOrders();
        const orderId = orders[0].id as number;

        await orderStore.deleteOrder(orderId);
        const remainingOrders = await orderStore.getAllOrders();

        expect(remainingOrders.find((o: any) => o.id === orderId)).toBeUndefined();
    });
});