const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    
    // Sử dụng đường dẫn tuyệt đối thay vì tương đối
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');
    
    // Config static files với đường dẫn tuyệt đối
    app.use(express.static(path.join(__dirname, '..', 'public')))
}

module.exports = configViewEngine;