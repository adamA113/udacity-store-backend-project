import request from "supertest";
// @ts-ignore
import client from "../../database";

const BASE = "localhost:3001";

describe('Users APIS: ', () => {
    let token: string = "";
    let id: number | null = null;

    beforeEach(async () => {
        const res = await request(BASE)
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
        id = res.body.user.id;
        token = res.body.token;
    });

    it('POST /users/create should return a new user', async () => {
        expect(token).toBeDefined();
        expect(id).toBeDefined();
    })

    it('GET /users should return all users', async () => {
        const res = await request(BASE)
            .get("/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect("content-type", /json/);

        expect(res.body).toBeDefined();
        expect(Array.isArray(res.body)).toBeTrue();
    })
 
    it('GET /users/:id should show a user', async () => {
        const res = await request(BASE)
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(res.body).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                 firstname: jasmine.any(String),
                 lastname: jasmine.any(String),
            })
        );
    })

    it('PUT /users/:id should update a user', async () => {
        const data = {
            firstname: "John",
            lastname: "Peter",
            password: "test456"
        };
        const res = await request(BASE)
            .put(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201)

        expect(res.body.lastname).toEqual('Peter');
    })

    it('DELETE /users/:id should delete a user', async () => {
        await request(BASE)
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                message: `User with id ${id} has been deleted successfully`,
            });
    })

    afterEach(async () => {
        // @ts-ignore
        const conn = await client.connect();
        const query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [id]);
        conn.release();
    });
})
