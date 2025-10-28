import request from "supertest";
// @ts-ignore
import client from "../../database";

const BASE = "localhost:3001";

describe('Product APIS: ', () => {
    let token: string = "";
    let userId: number | null = null;
    let productId: number | null = null;
    let category: string = "";

    beforeAll(async () => {
        let res = await request(BASE)
            .post("/users/create")
            .send({
                firstname: "John",               
                lastname: "Smith",
                password: "test123"
            })
            .expect(201)
            .expect("content-type", /json/);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
            jasmine.objectContaining({
                user: jasmine.objectContaining({
                    id: jasmine.any(Number),
                    firstname: jasmine.any(String),
                    lastname: jasmine.any(String),
                }),
                token: jasmine.any(String),
                message: "User has been created successfully!",
            })
        );
        userId = res.body.user.id;
        token = res.body.token;

        res = await request(BASE)
            .post("/products/create")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Sofa",
                price: 4979.99,
                category: "Sofa",
            })
            .expect(201)
            .expect("content-type", /json/);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
            jasmine.objectContaining({
                product: jasmine.objectContaining({
                    id: jasmine.any(Number),
                    name: jasmine.any(String),
                    price: jasmine.any(Number),
                    category: jasmine.any(String),
                }),
                message: "Product has been created successfully!",
            })
        );

        category = res.body.product.category;
        productId = res.body.product.id;
    });

    it('POST /products/create should return a new product after it is created', async () => {
        expect(productId).toBeDefined();
    })

    it('GET /products should show all products', async () => {
        const res = await request(BASE)
            .get('/products')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBeTrue();
    })

    it('GET /products/:id should show a product given an id', async () => {
        const res = await request(BASE)
            .get(`/products/${productId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                name: jasmine.any(String),
                price: jasmine.any(Number),
                category: jasmine.any(String),
            })
        );
    })

    it('PUT /products/:id should have an update product endpoint', async () => {
        const data = {
            name: 'Test edited',
            price: 50,
            category: "Test"
        }
        const res = await request(BASE)
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201);

            console.log(res.body)

        expect(res.body.category).toEqual('Test');
    })

    it('DELETE /products/:id should delete a product given its id', async () => {
        const res = await request(BASE)
            .delete(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(
            jasmine.objectContaining({
                message: jasmine.any(String),
            })
        );
    })

    afterAll(async () => {
        // @ts-ignore
        const conn = await client.connect();
        let query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [userId]);
        query = `DELETE FROM products WHERE id=($1)`;
        await conn.query(query, [productId]);
        conn.release();
    });
})