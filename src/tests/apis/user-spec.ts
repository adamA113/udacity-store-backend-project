import request from "supertest";
// @ts-ignore
import client from "../../database";

const BASE = "localhost:3001";

describe('Users APIS: ', () => {
    let token: String = "";
    let id: Number | null = null;

    beforeAll(async () => {
        const res = await request(BASE)
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
                    firstName: jasmine.any(String),
                    lastName: jasmine.any(String),
                }),
                token: jasmine.any(String),
                message: "User created successfully!",
            })
        );
        id = res.body.User.id;
        token = res.body.token;
    });

    it('POST /users/create should return a new user', async () => {
        const data = {
            firstName: "John",
            lastName: "Smith",
            password: "test123"
        };
        await request(BASE)
            .post('/api/users/create')
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect(201)
            .expect({
                id: 1,
                firstName: "John",
                lastName: "Smith",
                password: "test123"
            });
    })

    it('POST /users/create should fail if required firstName is not sent', async () => {
        const data = {
            lastName: "Smith",
            password: "test123"
        };
        await request(BASE)
            .post('/api/users/create')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect({
                error: 'Missing firstName',
            });
    })

    it('GET /users should return all users', async () => {
        await request(BASE)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect([
                {
                    id: 1,
                    firstName: "John",
                    lastName: "Smith",
                    password: "test123"
                },
            ]);
    })
 
    it('GET /users/:id should show a user', async () => {
        await request(BASE)
            .get('/api/users/1')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect({
                id: 1,
                firstName: "John",
                lastName: "Smith",
                password: "test123"
            });
    })

    it('PUT /users/:id should update a user', async () => {
        const data = {
            firstName: "John",
            lastName: "Smith",
            password: "test456"
        };
        await request(BASE)
            .put('/api/users/1')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                id: 1,
                firstName: "John",
                lastName: "Smith",
                password: "test456"
            });
    })

    it('DELETE /users/:id should delete a user', async () => {
        await request(BASE).delete('/api/users/1').expect(200).expect({
            status: 'Deleted user 1',
        });
    })

    afterAll(async () => {
        // @ts-ignore
        const conn = await client.connect();
        const query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [id]);
        conn.release();
    });
})
