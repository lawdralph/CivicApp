const express = require('express');
const config = require('./config');
const routes = require('./routes');

const app = express();
const port = config.port;

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
