const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')
const {upload_novel, upload_transaction} = require('../middlewares/upload');
const {LogOut} = require('../controllers/user/logoutController')
const {ProfileHomePage, UserProfile, ChangePassword, NovelOwnLimit, UserBuyPlans, AddNovelPage, AddNewNovel, ReadBookMark} = require('../controllers/user/profileController')
const {NovelReport, AddNovelToLibrary} = require('../controllers/user/novelController')
const {AddChapterPage,
    AddNewChapter, ChapterDetail, UpdateChapterPage, UpdateChapter, AddBookMark} = require('../controllers/user/chapterController')
const {AddDiscussionPage, AddDiscussion, DiscussionDetail, DiscussionLike, DiscussionComment, DiscussionReport} = require('../controllers/user/discussionController')


router.get("/logout", LogOut);

router.get('/profile', auth.isAuthenticated, ProfileHomePage);
router.get('/profile/:id', auth.isAuthenticated, UserProfile);
router.post('/profile/:id/change-password',auth.isAuthenticated, ChangePassword);
router.get('/check-novel-limit',auth.isAuthenticated, NovelOwnLimit);
router.post('/purchase',upload_transaction.single('proofImage'), UserBuyPlans);
router.get('/upload', auth.isAuthenticated, AddNovelPage);
router.post('/upload', auth.isAuthenticated, upload_novel.single('coverImage'), AddNewNovel);
router.get('/novel/:NovelID/continue', auth.isAuthenticated, ReadBookMark);

router.post('/novels/:id/report',auth.isAuthenticated, NovelReport);
router.post('/novels/:id/save',auth.isAuthenticated, AddNovelToLibrary);
router.get('/novels/:id/add-chapter',auth.isAuthenticated, AddChapterPage);
router.post('/novels/:id/add-chapter',auth.isAuthenticated, AddNewChapter);
router.get('/read/:NovelID/chapter/:ChapterNumber', auth.isAuthenticated, ChapterDetail);
router.get('/novels/:novelId/update/:chapterNumber', auth.isAuthenticated, UpdateChapterPage);
router.post('/novels/:novelId/update/:chapterNumber', auth.isAuthenticated, UpdateChapter);
router.post('/bookmark', auth.isAuthenticated, AddBookMark);

router.get("/discussions/new", auth.isAuthenticated, AddDiscussionPage);
router.post("/discussions/new",auth.isAuthenticated, AddDiscussion);
router.get("/discussions/:DiscussionID",auth.isAuthenticated, DiscussionDetail);
router.post("/discussions/:DiscussionID/like",auth.isAuthenticated, DiscussionLike);
router.post("/discussions/:DiscussionID/comment",auth.isAuthenticated, DiscussionComment);
router.post("/discussions/:DiscussionID/report",auth.isAuthenticated, DiscussionReport);

module.exports = router;