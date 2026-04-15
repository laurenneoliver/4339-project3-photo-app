import express from 'express';
import userController from '../controllers/userController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();

router.post('/user', userController.createUser);
router.get('/user/list', requireLogin, userController.getListOfUsers);
router.get('/user/:id', requireLogin, userController.getUserById);

export default router;
