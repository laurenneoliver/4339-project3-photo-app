import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/admin/login', authController.login);
router.post('/admin/logout', authController.logout);

export default router;
