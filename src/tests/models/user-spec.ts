import { UserModel } from '../../models/user';
// @ts-ignore
import client from "../../database";

const store = new UserModel();

describe('User Model', () => {
    let id: number;
    beforeAll(async () => {
        const result = await store.createNewUser({
            firstname: 'Sallie',
            lastname: 'Test',
            password: 'password123',
        });
        id = result.id as number;
        expect(result.password).toEqual('password123');
    })

    it('should update a specific user', async () => {
        const users = await store.getAllUsers();
        const userId = id;

        const result = await store.updateUser({
            id: userId,
            firstname: 'Madison',
            lastname: 'Tester',
            password: 'password123',
        });
        expect(result).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                firstname: jasmine.any(String),
                lastname: jasmine.any(String),
            })
        );
    })

    it('should return a list of users', async () => {
        const result = await store.getAllUsers();
        expect(Array.isArray(result)).toBeTrue();
    })

    it('should return a specific user', async () => {
        expect(store.getUserById).toBeDefined();
        const user = await store.getUserById(Number(id));
        expect(user).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                firstname: jasmine.any(String),
                lastname: jasmine.any(String),
            })
        );
    })

    it('should delete a specific user', async () => {
        const userId = id;

        await store.deleteUser(userId);
        let users = await store.getAllUsers();

        expect(users.length).toEqual(0);
    })

    afterAll(async () => {
        // @ts-ignore
        const conn = await client.connect();
        const query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [id]);
        conn.release();
    });
})