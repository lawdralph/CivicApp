const { Report } = require('../models');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
let s3Client = null;
if (S3_BUCKET && AWS_REGION) {
  AWS.config.update({ region: AWS_REGION });
  s3Client = new AWS.S3();
}

const normalizeStatus = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  const map = {
    pending: 'pending',
    under_review: 'under_review',
    'under review': 'under_review',
    in_progress: 'in_progress',
    'in progress': 'in_progress',
    resolved: 'resolved',
    rejected: 'rejected',
  };

  return map[raw] || 'pending';
};

const buildLocation = (req) => {
  const lat = Number(req.body.latitude ?? req.body.lat ?? req.body.location?.lat);
  const lng = Number(req.body.longitude ?? req.body.lng ?? req.body.location?.lng);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  return null;
};

exports.createReport = async (req, res) => {
  try {
    const location = buildLocation(req);
    const reportId = req.body.reportId || `CIV-${Date.now()}`;

    let photoUrl = req.body.photoUrl || '';
    if (req.file) {
      if (!s3Client || !S3_BUCKET || !AWS_REGION) {
        return res.status(500).json({ success: false, message: 'File uploads not configured. Set S3_BUCKET and AWS_REGION.' });
      }

      const key = `reports/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      await s3Client.putObject({
        Bucket: S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      }).promise();

      photoUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    }

    const payload = {
      reportId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      status: normalizeStatus(req.body.status || 'pending'),
      location,
      photoUrl,
    };

    if (!payload.title || !payload.description || !payload.category || !payload.location || !payload.location.lat || !payload.location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required report fields: title, description, category, and valid location are required.',
      });
    }

    const report = new Report(payload);
    const savedReport = await report.save();

    res.status(201).json({
      success: true,
      data: savedReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateReport = async (req, res) => {
  const id = req.params.id || req.body.reportId || req.body.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Missing report id for update. Use /api/reports/:id or include reportId in the request body.',
    });
  }

  try {
    const or = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      or.push({ _id: id });
    }
    or.push({ reportId: id });

    const filter = or.length === 1 ? or[0] : { $or: or };
    const updatePayload = { ...req.body };

    if (updatePayload.status) {
      updatePayload.status = normalizeStatus(updatePayload.status);
    }

    if (updatePayload.latitude || updatePayload.longitude || updatePayload.lat || updatePayload.lng) {
      updatePayload.location = buildLocation(req);
    }

    const updatedReport = await Report.findOneAndUpdate(
      filter,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const or = [];

    if (mongoose.Types.ObjectId.isValid(id)) {
      or.push({ _id: id });
    }
    or.push({ reportId: id });

    const filter = or.length === 1 ? or[0] : { $or: or };
    const report = await Report.findOne(filter);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.',
      });
    }

    const normalized = normalizeStatus(status);
    const or = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      or.push({ _id: id });
    }
    or.push({ reportId: id });

    const filter = or.length === 1 ? or[0] : { $or: or };
    const updatedReport = await Report.findOneAndUpdate(
      filter,
      { status: normalized },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: updatedReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
