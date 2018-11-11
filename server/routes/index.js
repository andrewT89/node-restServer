const express = require('express');

const app = express();

app.use(require('./usuario-route'));
app.use(require('./login-route'));
app.use(require('./category-route'));
app.use(require('./product-route'));

module.exports = app;