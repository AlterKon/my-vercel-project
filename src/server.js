const express = require('express');
const session = require('./config/session');
const cors = require('cors');
const path = require('path');
const { setLocals } = require('./middlewares/authMiddleware');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const configViewEngine = require('./config/viewengine');

const app = express();

app.use(session);
app.use(setLocals);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);

app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
