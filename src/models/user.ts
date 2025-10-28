// @ts-ignore
import client from '../database';
import { User } from '../helpers/types';

export class UserModel {
    async getAllUsers(): Promise<User[]> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'SELECT * FROM users';
            const result = await connection.query(query);
            connection.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all users. Error: ${err}`)
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'SELECT * FROM users WHERE id=($1)';
            const result = await connection.query(query, [id]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find the user with id ${id}. Error: ${err}`)
        }
    }

    async createNewUser(user: User): Promise<User> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'
            const result = await connection.query(query, [
                user.firstname,
                user.lastname,
                user.password,
            ]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add new user. Error: ${err}`);
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = `UPDATE users SET firstname = $2, lastname = $3, password = $4 WHERE id = $1 RETURNING *`
            const result = await connection.query(query, [
                user.id,
                user.firstname,
                user.lastname,
                user.password,
            ]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update user with id ${user.id}. Error: ${err}`);
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            // @ts-ignore
            const connection = await client.connect();
            const query = 'DELETE FROM users WHERE id=($1)';
            const result = await connection.query(query, [id]);
            connection.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete the user with id ${id}. Error: ${err}`);
        }
    }
}