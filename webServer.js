import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcrypt";

// Used when you implement the TODO handlers below.
// eslint-disable-next-line no-unused-vars
import User from "./schema/user.js";
// eslint-disable-next-line no-unused-vars
import Photo from "./schema/photo.js";

const app = express();

// define these in env and import in this file
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project3";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret";

// Enable CORS for frontend running on a different port
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Connect to MongoDB
mongoose.connect(mongoUrl);

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:"),
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function requireLogin(req, res, next) {
  if (!req.session.user_id) {
    return res.status(401).send("Not logged in");
  }
  next();
}

/**
 * POST /admin/login
 * Logs in an admin user.
 */
app.post("/admin/login", async (req, res) => {
  try {
    const { login_name, password } = req.body;

    if (!login_name || !password) {
      return res.status(400).send("Missing login_name or password");
    }

    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).send("Invalid login name or password");
    }

    const isMatch = await bcrypt.compare(password, user.password_digest);

    if (!isMatch) {
      return res.status(400).send("Invalid login name or password");
    }

    req.session.user_id = user._id;

    return res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
      login_name: user.login_name,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * POST /admin/logout
 * Logs out an admin user.
 */

app.post("/admin/logout", (req, res) => {
  if (!req.session.user_id) {
    return res.status(400).send("No user currently logged in");
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    return res.status(200).send("Logged out");
  });
});

/**
 * POST /user
 * Creates a new user.
 */

app.post("/user", async (req, res) => {
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
        .send("login_name, password, first_name, and last_name are required");
    }

    const existingUser = await User.findOne({ login_name });

    if (existingUser) {
      return res.status(400).send("login_name already exists");
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
});

/**
 * GET /user/list
 * Returns the list of users.
 */
app.get("/user/list", requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");

    const result = users.map((user) => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /user/:id
 * Returns the details of one user.
 */
app.get("/user/:id", requireLogin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
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
});

/**
 * GET /photosOfUser/:id
 * Returns all photos of the given user.
 */
app.get("/photosOfUser/:id", requireLogin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    // TODO:
    // 1. Find all photos whose user_id matches userId.
    // 2. Fetch all users from MongoDB.
    // 3. Build a lookup structure from user _id to user object.
    // 4. For each photo, construct the response expected by the frontend.
    // 5. For each comment, include the corresponding user object in comment.user.
    // 6. Return the resulting array.

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const photos = await Photo.find({ user_id: userId });
    const users = await User.find({}, "_id first_name last_name");

    const userMap = {};
    users.forEach((userDoc) => {
      userMap[userDoc._id.toString()] = {
        _id: userDoc._id,
        first_name: userDoc.first_name,
        last_name: userDoc.last_name,
      };
    });

    // build response
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
});

/**
 * POST /commentsOfPhoto/:photoId
 * Add a comment to a photo by a logged-in user.
 * Requires valid photoId and non-empty comment text.
 * Stores comment with timestamp and session user_id.
 */

app.post("/commentsOfPhoto/:photoId", requireLogin, async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const { comment } = req.body;

    if (!isValidObjectId(photoId)) {
      return res.status(400).send("Invalid photo id");
    }

    if (!comment || !comment.trim()) {
      return res.status(400).send("Comment text is required");
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).send("Photo not found");
    }

    photo.comments.push({
      comment: comment.trim(),
      date_time: new Date(),
      user_id: req.session.user_id,
    });

    await photo.save();

    return res.status(200).send("Comment added");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
