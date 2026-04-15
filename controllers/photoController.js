import { isValidObjectId } from 'mongoose';
import User from '../schema/user.js';
import Photo from '../schema/photo.js';

const getPhotosOfUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const photos = await Photo.find({ user_id: userId });
    const users = await User.find({}, '_id first_name last_name');

    const userMap = {};
    users.forEach((userDoc) => {
      userMap[userDoc._id.toString()] = {
        _id: userDoc._id,
        first_name: userDoc.first_name,
        last_name: userDoc.last_name,
      };
    });

    const result = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: photo.comments.map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: userMap[comment.user_id.toString()],
      })),
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const addCommentToPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { comment } = req.body;

    if (!isValidObjectId(photoId)) {
      return res.status(400).send('Invalid photo id');
    }

    if (!comment || !comment.trim()) {
      return res.status(400).send('Comment text is required');
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).send('Photo not found');
    }

    photo.comments.push({
      comment: comment.trim(),
      date_time: new Date(),
      user_id: req.session.user_id,
    });

    await photo.save();

    return res.status(200).send('Comment added');
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export default {
  getPhotosOfUser,
  addCommentToPhoto,
};
