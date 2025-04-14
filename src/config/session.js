const session = require('express-session');
require('dotenv').config();

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'chuoi-bi-mat-mac-dinh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 ngày
    }
});

module.exports = sessionMiddleware;
