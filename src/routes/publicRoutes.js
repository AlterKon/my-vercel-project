const express = require('express');
const router = express.Router();

const {HomePage, FindNovels} = require('../controllers/public/homeController')
const {LoginPage, CheckAccount} = require('../controllers/public/loginController')
const {RegisterPage, CheckNewAccount} = require('../controllers/public/registerController')
const {NovelHomePage, NovelDetails} = require('../controllers/public/novelController')
const {GenreHomePage, GenreDetails} = require('../controllers/public/genreController')
const {DiscussionHomePage} = require('../controllers/public/discussionController')

router.get("/", HomePage);
router.get("/search", FindNovels);

router.get('/login', LoginPage);
router.post("/login", CheckAccount);

router.get("/register", RegisterPage);
router.post("/register", CheckNewAccount);

router.get('/novels', NovelHomePage);
router.get('/novels/:id', NovelDetails);

router.get('/genres', GenreHomePage);
router.get('/genres/:id', GenreDetails);

router.get("/discussions", DiscussionHomePage);

module.exports = router;