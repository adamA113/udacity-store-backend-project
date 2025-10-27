import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';

const userTable = new UserModel();
const pepper: string = process.env.BCRYPT_PASSWORD as string;
const saltRounds: number = parseInt(process.env.SALT_ROUNDS as string);

export default class UsersController {
    async getAllUsers(_req: express.Request, res: express.Response) {
        try {
            const users = await userTable.getAllUsers();

            return res.status(200).json(users);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async getUserById(req: express.Request, res: express.Response) {
        try {
            const user = await userTable.getUserById(parseInt(req.params.id));

            if (user?.id) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({
                    error: `Couldn't find user with id ${req.params.id}`
                });
            }
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async createNewUser(req: express.Request, res: express.Response) {
        try {
            if (!req.body.firstName || !req.body.lastName || !req.body.password) {
                return res.status(400).json({
                    error: 'Missing username (first or last name), or password'
                });
            }

            const hashedPassword = bcrypt.hashSync(req.body.password + pepper, saltRounds);

            try {
                const newUser = await userTable.createNewUser({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: hashedPassword,
                });

                if (newUser) {
                    const token: string = jwt.sign(
                        {
                            id: newUser.id,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName
                        },
                        process.env.JWT_SECRET as string
                    );
                    return res.status(201).json({
                        User: newUser,
                        token,
                        message: "User has been created successfully!",
                    });
                } else {
                    return res.status(500).json({ error: "Error in creating the user" });
                }
            } catch (e) {
                return res.status(500).json(e);
            }
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async updateUser(req: express.Request, res: express.Response) {
        try {
            if (!req.body.firstName || !req.body.lastName) {
                return res.status(400).json({
                    error: 'User first and last names are required',
                });
            } else if (!req.body.password) {
                return res.status(400).json({
                    error: 'User password is required',
                });
            }

            const user = await userTable.updateUser({
                id: parseInt(req.params.id),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
            });

            return res.status(201).json(user);
        } catch (e) {
            return res.status(500).json(e);
        }
    }

    async deleteUser(req: express.Request, res: express.Response) {
        try {
            await userTable.deleteUser(parseInt(req.params.id));
            return res.status(200).json({ message: `User with id ${req.params.id} has been deleted successfully` });
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}