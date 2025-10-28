import request from "supertest";
// @ts-ignore
import client from "../../database";
import app from "../../server";

const BASE = app;

describe('Orders APIs: ', () => {
    let token: string = "";
    let userId: number | null = null;
    let orderId: number | null = null;
    let productId: number | null = null;

    beforeAll(async () => {
        const userRes = await request(BASE)
            .post("/users/create")
            .send({
                firstname: "Order",
                lastname: "TestUser",
                password: "test123"
            })
            .expect(201)
            .expect("content-type", /json/);

        userId = userRes.body.user.id;
        token = userRes.body.token;

        const productRes = await request(BASE)
            .post("/products/create")
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Test Product",
                price: 99.99,
                category: "Test Category"
            })
            .expect(201)
            .expect("content-type", /json/);

        productId = productRes.body.product.id;

        const orderRes = await request(BASE)
            .post('/orders/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: false
            })
            .expect('Content-Type', /json/)
            .expect(201);

        console.log(orderRes.body)

        expect(orderRes.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                user_id: userId,
                status: false
            })
        );
        orderId = orderRes.body.id;
    });

    it('POST /orders/create should create a new order', async () => {
        expect(orderId).toBeDefined();
    });

    it('GET /orders should return all orders', async () => {
        const res = await request(BASE)
            .get('/orders')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBeTrue();
    });

    it('GET /orders/:id should show a specific order', async () => {
        const res = await request(BASE)
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                user_id: jasmine.any(Number),
                status: jasmine.any(Boolean)
            })
        );
    });

    it('GET /orders/current/:user_id should return current orders for user', async () => {
        const res = await request(BASE)
            .get(`/orders/current/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBeTrue();
    });

    it('POST /orders/add-product should add product to order', async () => {
        const data = {
            order_id: orderId,
            product_id: productId,
            quantity: 2
        };

        const res = await request(BASE)
            .post(`/orders/add-product`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                order_id: jasmine.any(Number),
                product_id: jasmine.any(Number),
                quantity: jasmine.any(Number)
            })
        );
    });

    it('PUT /orders/:id should update an order', async () => {
        const data = {
            user_id: userId,
            status: true
        };

        const res = await request(BASE)
            .put(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                user_id: jasmine.any(Number),
                status: jasmine.any(Boolean)
            })
        );
    });

    it('DELETE /orders/:id should delete an order', async () => {
        const res = await request(BASE)
            .delete(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                message: jasmine.any(String)
            })
        );
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

        if (orderId) {
            // @ts-ignore
            const conn = await client.connect();
            const deleteOrderQuery = `DELETE FROM orders WHERE id=($1)`;
            await conn.query(deleteOrderQuery, [orderId]);
            conn.release();
        }
    });
});