import { Router } from 'express';
import { getUsers, login } from './auth.controller.js';
import { loginValidator } from '../middlewares/validator.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
)

router.get('/', getUsers)


export default router;