const express = require('express');
const multer = require('multer');
const path = require('path');
const { createReport, getReports, getReportById, updateReport, updateReportStatus } = require('../controllers');
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Use memory storage and let the controller upload to S3 for persistence
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPG and PNG images are allowed.'));
  },
});

router.get('/', (req, res) => {
  res.json({ message: 'CivicApp backend is running' });
});

router.post('/api/admin/login', loginAdmin);
router.get('/api/admin/profile', auth, getAdminProfile);
router.get('/api/admin/reports', auth, getReports);
router.get('/api/admin/reports/:id', auth, getReportById);
router.patch('/api/admin/reports/:id/status', auth, updateReportStatus);

router.get('/api/reports', getReports);
router.get('/api/reports/:id', getReportById);
router.post('/api/reports', upload.single('photo'), createReport);
router.put('/api/reports', updateReport);
router.put('/api/reports/:id', updateReport);
router.patch('/api/reports/:id/status', updateReportStatus);

module.exports = router;
