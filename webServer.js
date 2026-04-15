import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import photoRoutes from './routes/photoRoutes.js';

const app = express();

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/project3';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret';

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

mongoose.connect(mongoUrl);

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(authRoutes);
app.use(userRoutes);
app.use(photoRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
