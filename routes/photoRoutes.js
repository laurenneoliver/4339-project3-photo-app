import express from 'express';
import photoController from '../controllers/photoController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();

router.get('/photosOfUser/:id', requireLogin, photoController.getPhotosOfUser);
router.post(
  '/commentsOfPhoto/:photoId',
  requireLogin,
  photoController.addCommentToPhoto,
);

export default router;
