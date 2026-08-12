const { Report } = require('../models');
const mongoose = require('mongoose');

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

    const payload = {
      reportId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      status: normalizeStatus(req.body.status || 'pending'),
      location,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : (req.body.photoUrl || ''),
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
