import express from 'express';
import UsersControllers from '../../handlers/users';
import { auth } from '../../middleware/index';

const usersRouter = express.Router();
const UserController = new UsersControllers();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.get('/:id', UserController.getUserById);
usersRouter.post('/create', UserController.createNewUser);
usersRouter.put('/:id', auth, UserController.updateUser);
usersRouter.delete('/:id', auth, UserController.deleteUser);

export default usersRouter;