const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')
const {upload, upload_transaction} = require('../middlewares/upload');
const {LogOut} = require('../controllers/user/logoutController')
const {ProfileHomePage, UserProfile, ChangePassword, NovelOwnLimit, UserBuyPlans, AddNovelPage, AddNewNovel, ReadBookMark} = require('../controllers/user/profileController')
const {NovelReport, AddNovelToLibrary} = require('../controllers/user/novelController')
const {AddChapterPage,
    AddNewChapter, ChapterDetail, UpdateChapterPage, UpdateChapter, AddBookMark} = require('../controllers/user/chapterController')
const {AddDiscussionPage, AddDiscussion, DiscussionDetail, DiscussionLike, DiscussionComment, DiscussionReport} = require('../controllers/user/discussionController')


router.get("/logout", LogOut);

router.get('/profile', auth.isAuthenticated, ProfileHomePage);
router.get('/profile/:id', auth.isAuthenticated, UserProfile);
router.post('/profile/:id/change-password', ChangePassword);
router.get('/check-novel-limit', NovelOwnLimit);
router.post('/purchase',upload_transaction.single('proofImage'), UserBuyPlans);
router.get('/upload', auth.isAuthenticated, AddNovelPage);
router.post('/upload', auth.isAuthenticated, upload_novel.single('coverImage'), AddNewNovel);
router.get('/novel/:NovelID/continue', auth.isAuthenticated, ReadBookMark);

router.post('/novels/:id/report', NovelReport);
router.post('/novels/:id/save', AddNovelToLibrary);
router.get('/novels/:id/add-chapter', AddChapterPage);
router.post('/novels/:id/add-chapter', AddNewChapter);
router.get('/read/:NovelID/chapter/:ChapterNumber', auth.isAuthenticated, ChapterDetail);
router.get('/novels/:novelId/update/:chapterNumber', auth.isAuthenticated, UpdateChapterPage);
router.post('/novels/:novelId/update/:chapterNumber', auth.isAuthenticated, UpdateChapter);
router.post('/bookmark', auth.isAuthenticated, AddBookMark);

router.get("/discussions/new", auth.isAuthenticated, AddDiscussionPage);
router.post("/discussions/new", AddDiscussion);
router.get("/discussions/:DiscussionID",auth.isAuthenticated, DiscussionDetail);
router.post("/discussions/:DiscussionID/like", DiscussionLike);
router.post("/discussions/:DiscussionID/comment", DiscussionComment);
router.post("/discussions/:DiscussionID/report", DiscussionReport);

module.exports = router;