import { UserModel } from '../../models/user';

const store = new UserModel();

describe('User Model', () => {
    
    it('should create new user', async () => {
        const result = await store.createNewUser({
            firstName: 'Sallie',
            lastName: 'Test',
            password: 'password123',
        });
        expect(result.password).toEqual('password123');
    })

    it('should update a specific user', async () => {
        const users = await store.getAllUsers();
        const userId = users[0].id;

        const result = await store.updateUser({
            id: userId,
            firstName: 'Madison',
            lastName: 'Tester',
            password: 'password123',
        });
        expect(result.firstName).toEqual('madison');
    })

    it('should return a list of users', async () => {
        const result = await store.getAllUsers();
        expect(result.length).toEqual(1);
    })

    it('should return a specific user', async () => {
        const users = await store.getAllUsers();
        const userId = users[0].id as number;

        const result = await store.getUserById(userId);
        expect(result.firstName).toEqual('madison');
    })

    it('should delete a specific user', async () => {
        let users = await store.getAllUsers();
        const userId = users[0].id as number;

        await store.deleteUser(userId);
        users = await store.getAllUsers();

        expect(users.length).toEqual(0);
    })
})