import bcrypt from 'bcrypt';
import User from '../schema/user.js';

const login = async (req, res) => {
  try {
    const { login_name, password } = req.body;

    if (!login_name || !password) {
      return res.status(400).send('Missing login_name or password');
    }

    const user = await User.findOne({ login_name });

    if (!user) {
      return res.status(400).send('Invalid login name or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_digest);

    if (!isMatch) {
      return res.status(400).send('Invalid login name or password');
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
};

const logout = (req, res) => {
  if (!req.session.user_id) {
    return res.status(400).send('No user currently logged in');
  }

  return req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    return res.status(200).send('Logged out');
  });
};

export default { login, logout };
