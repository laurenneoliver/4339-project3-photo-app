import bcrypt from 'bcrypt';
import { isValidObjectId } from 'mongoose';
import User from '../schema/user.js';

const createUser = async (req, res) => {
  try {
    const {
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    } = req.body;

    if (!login_name || !password || !first_name || !last_name) {
      return res
        .status(400)
        .send('login_name, password, first_name, and last_name are required');
    }

    const existingUser = await User.findOne({ login_name });

    if (existingUser) {
      return res.status(400).send('login_name already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      login_name,
      password_digest: passwordHash,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    return res.status(200).json({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      location: newUser.location,
      description: newUser.description,
      occupation: newUser.occupation,
      login_name: newUser.login_name,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getListOfUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name');

    const result = users.map((user) => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export default {
  createUser,
  getListOfUsers,
  getUserById,
};
