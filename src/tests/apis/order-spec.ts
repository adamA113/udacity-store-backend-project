import request from "supertest";
// @ts-ignore
import client from "../../database";

const BASE = "localhost:3001";

describe('Orders APIs: ', () => {
    let token: String = "";
    let userId: Number | null = null;
    let orderId: Number | null = null;
    let productId: Number | null = null;

    beforeAll(async () => {
        const userRes = await request(BASE)
            .post("/api/users/create")
            .send({
                firstName: "Order",
                lastName: "TestUser",
                password: "test123"
            })
            .expect(201);

        userId = userRes.body.User.id;
        token = userRes.body.token;

        const productRes = await request(BASE)
            .post("/api/products/create")
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Test Product",
                price: 99.99,
                category: "Test Category"
            })
            .expect(201);

        productId = productRes.body.id;
    });

    it('POST /orders/create should create a new order', async () => {
        const data = {
            user_id: userId,
            status: false
        };
        
        const res = await request(BASE)
            .post('/api/orders/create')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect(201);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                user_id: userId,
                status: false
            })
        );
        orderId = res.body.id;
    });

    it('GET /orders should return all orders', async () => {
        await request(BASE)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(jasmine.any(Array));
    });

    it('GET /orders/:id should show a specific order', async () => {
        await request(BASE)
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect(jasmine.objectContaining({
                id: orderId,
                user_id: userId,
                status: false
            }));
    });

    it('GET /orders/current/:user_id should return current orders for user', async () => {
        await request(BASE)
            .get(`/api/orders/current/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(jasmine.any(Array));
    });

    it('POST /orders/add-product/:id should add product to order', async () => {
        const data = {
            order_id: orderId,
            product_id: productId,
            quantity: 2
        };

        await request(BASE)
            .post(`/api/orders/add-product/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect(jasmine.objectContaining({
                order_id: orderId,
                product_id: productId,
                quantity: 2
            }));
    });

    it('PUT /orders/:id should update an order', async () => {
        const data = {
            user_id: userId,
            status: true
        };

        await request(BASE)
            .put(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect(201)
            .expect(jasmine.objectContaining({
                id: orderId,
                user_id: userId,
                status: true
            }));
    });

    it('DELETE /orders/:id should delete an order', async () => {
        await request(BASE)
            .delete(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect({
                message: `Order with id ${orderId} has been deleted successfully`
            });
    });

    afterAll(async () => {
        if (userId) {
            // @ts-ignore
            const conn = await client.connect();
            const deleteUserQuery = `DELETE FROM users WHERE id=($1)`;
            await conn.query(deleteUserQuery, [userId]);
            conn.release();
        }

        if (productId) {
            // @ts-ignore
            const conn = await client.connect();
            const deleteProductQuery = `DELETE FROM products WHERE id=($1)`;
            await conn.query(deleteProductQuery, [productId]);
            conn.release();
        }
    });
});