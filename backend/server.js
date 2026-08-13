const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const routes = require('./routes');

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

app.use('/', routes);

// Serve frontend static build if present (single-service deployment)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    // Skip API and uploads routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
