import request from "supertest";
// @ts-ignore
import client from "../../database";

const BASE = "localhost:3001";

describe('Product APIS: ', () => {
    let token: String = "";
    let id: Number | null = null;
    let pid: Number | null = null;
    let category: String = "";

    beforeAll(async () => {
        let res = await request(BASE)
            .post("/users")
            .send({
                firstName: "John",
                lastName: "Smith",
                password: "test123"
            })
            .expect(201)
            .expect("content-type", /json/i);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
            jasmine.objectContaining({
                User: jasmine.objectContaining({
                    id: jasmine.any(Number),
                    firstname: jasmine.any(String),
                    lastname: jasmine.any(String),
                }),
                token: jasmine.any(String),
                message: "User created successfully!",
            })
        );
        id = res.body.User.id;
        token = res.body.token;

        res = await request(BASE)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Sofa",
                price: 4979.99,
                category: "Sofa",
            })
            .expect(200)
            .expect("content-type", /json/i);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                name: jasmine.any(String),
                price: jasmine.any(String),
                category: jasmine.any(String),
            })
        );

        category = res.body.category;
        pid = res.body.id;
    });

    it('POST /products/create should return a new user after it is created', async () => {
        const data = {
            name: 'Test',
            price: 67.0,
            category: 'category a',
        }
        await request(BASE)
            .post('/api/products/create')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({
                id: 1,
                name: 'Test',
                price: 67.0,
                category: 'category a',
            })
    })

    it('POST /products/create create product should fail if name is not included in parameters', async () => {
        const data = {
            name: 'Test',
            price: 40.0,
            category: 'category b',
        }
        await request(BASE)
            .post('/api/products/create')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(400)
            .expect({
                error: 'Error: Product name is required',
            })
    })

    it('GET /products should show all products', async () => {
        await request(BASE)
            .get('/api/products')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                id: 1,
                name: 'Test',
                price: 40.0,
                category: 'category a',
            })
    })

    it('GET /products/:id should show a product given an id', async () => {
        await request(BASE)
            .get('/api/products/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                id: 1,
                name: 'Test',
                price: 40.0,
                category: 'category a',
            })
    })

    it('PUT /products/:id should have an update product endpoint', async () => {
        const data = {
            name: 'Test edited',
            price: 50.0,
        }
        await request(BASE)
            .put('/api/products/1')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                id: 1,
                name: 'Test edited',
                price: 50.0,
                category: 'category a',
            })
    })

    it('DELETE /products/:id should delete a product given its id', async () => {
        await request(BASE)
            .delete('/api/products/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(async () => {
                await request(BASE).get('/api/products').expect({})
            })
    })

    afterAll(async () => {
        // @ts-ignore
        const conn = await client.connect();
        let query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [id]);
        query = `DELETE FROM products WHERE id=($1)`;
        await conn.query(query, [pid]);
        conn.release();
    });
})