const express = require('express');

const app = express();

app.use(require('./usuario-route'));
app.use(require('./login-route'));
app.use(require('./category-route'));
app.use(require('./product-route'));
app.use(require('./upload'));
app.use(require('./images'));

module.exports = app;