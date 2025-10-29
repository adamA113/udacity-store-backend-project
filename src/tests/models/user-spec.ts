import { UserModel } from '../../models/user';
// @ts-ignore
import client from "../../database";

const store = new UserModel();

describe('User Model', () => {
    let userId: number;

    beforeEach(async () => {
        const result = await store.createNewUser({
            firstname: 'Sallie',
            lastname: 'Test',
            password: 'password123',
        });
        userId = result.id as number;
        expect(result.password).toEqual('password123');
    })

    it('should update a specific user', async () => {
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
        const user = await store.getUserById(Number(userId));
        expect(user).toEqual(
            jasmine.objectContaining({
                id: jasmine.any(Number),
                firstname: jasmine.any(String),
                lastname: jasmine.any(String),
            })
        );
    })

    it('should delete a specific user', async () => {
        await store.deleteUser(userId);
        const user = await store.getUserById(Number(userId));

        expect(user).toBeUndefined();
    })

    afterEach(async () => {
        // @ts-ignore
        const conn = await client.connect();
        const query = `DELETE FROM users WHERE id=($1)`;
        await conn.query(query, [userId]);
        conn.release();
    });
})