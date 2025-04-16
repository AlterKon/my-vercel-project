const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware')
const {StatisticalHomePage} = require('../controllers/admin/statisticalController');
const {FindByName, AddNewUser, UpdateUser, DeleteUser} = require('../controllers/admin/userController');
const {FindNovels, UpdateNovel, LockNovel, DeleteNovel} = require('../controllers/admin/novelController');
const {GenresHomePage, AddNewGenre, UpdateGenre, DeleteGenre} = require('../controllers/admin/genreController');
const {TransactionHomePage, UpdateTransactionStatus} = require('../controllers/admin/transactionController');
const {DiscussionHomePage, DeleteDiscussion} = require('../controllers/admin/discussionController');
const {ReportHomePage, ResolveReport} = require('../controllers/admin/reportController');
const {SubscriptionHomePage, AddNewSubscription, UpdateSubscription, DeleteSubscription} = require('../controllers/admin/subcriptionController');

router.get('/Statistical',auth.isAuthenticated, StatisticalHomePage);

//Quản lý người dùng
router.get('/Users',auth.isAuthenticated, FindByName);
router.get("/search-users", FindByName);
router.post('/create-user', AddNewUser);
router.post('/update-user', UpdateUser);
router.delete('/delete-user', DeleteUser);
//Quản lý tiểu thuyết
router.get('/Novels', auth.isAuthenticated, FindNovels);
router.get("/search-novels", FindNovels); 
router.post('/Novels/update',UpdateNovel);
router.post('/Novels/lock',LockNovel);
router.delete('/delete-novel', DeleteNovel);
//Quản lý thể loại
router.get('/Genres', auth.isAuthenticated, GenresHomePage);
router.post('/create-genre', AddNewGenre);
router.post('/update-genre', UpdateGenre);
router.delete('/delete-genre', DeleteGenre);
//Quản lý giao dịch
router.get('/Transactions', auth.isAuthenticated, TransactionHomePage);
router.post("/update-transaction/:transactionID", UpdateTransactionStatus);
//Quản lý bài thảo luận
router.get('/Discussions', auth.isAuthenticated, DiscussionHomePage);
router.post("/Discussions/delete/:discussionID", DeleteDiscussion);
//Quản lý báo cáo
router.get('/Reports', auth.isAuthenticated, ReportHomePage);
router.post('/ResolveReport/:type/:reportID', ResolveReport);
//Quản lý gói đọc
router.get('/SubscriptionPlans', auth.isAuthenticated, SubscriptionHomePage);
router.post('/create-subscription', AddNewSubscription);
router.post('/update-subscription', UpdateSubscription);
router.post('/delete-subscription', DeleteSubscription);

module.exports = router;