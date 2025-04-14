require('dotenv').config();
const express = require('express');
const session = require('./config/session');
const cors = require('cors');
const { setLocals } = require('./middlewares/authMiddleware');
const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const configViewEngine = require('./config/viewengine');

const app = express();

// Middleware chung
app.use(session);
app.use(setLocals);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
configViewEngine(app);

// Routes
app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Start
const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});