const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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

mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
