const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'civicapp-local-secret';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, message: 'Admin login not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.' });
  }

  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials.',
    });
  }

  const token = jwt.sign(
    {
      sub: 'admin',
      email: ADMIN_EMAIL,
      role: 'admin',
    },
    JWT_SECRET,
    { expiresIn: '8h' },
  );

  return res.status(200).json({
    success: true,
    data: {
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'admin',
      },
    },
  });
};

exports.getAdminProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      email: req.user.email,
      role: req.user.role,
    },
  });
};
