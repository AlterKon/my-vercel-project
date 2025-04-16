const novelService = require('../../services/novelService');

const NovelHomePage = async (req, res) => {
    try {
        const novels = await novelService.fetchAllNovelsWithLockStatus();

        res.render('partials/layout', {
            content: '../public/novel',
            novels,
            currentUser: req.session.user || null
        });
    } catch (err) {
        console.error("Lỗi khi load NovelHomePage:", err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const NovelDetails = async (req, res) => {
    const novelId = req.params.id;
    const currentUserId = req.session.user ? req.session.user.id : null;
    const message = req.session.message;
    delete req.session.message;

    try {
        const data = await novelService.getNovelDetails(novelId, currentUserId);
        if (!data) {
            return res.status(404).send("Không tìm thấy tiểu thuyết.");
        }

        res.render('partials/layout', {
            content: '../public/detail',
            novel: data.novel,
            genres: data.genres,
            chapters: data.chapters,
            isAuthor: data.isAuthor,
            currentUser: req.session.user,
            message
        });
    } catch (error) {
        console.error("Lỗi khi load NovelDetails:", error);
        res.status(500).send("Lỗi máy chủ");
    }
};

module.exports = {
    NovelHomePage, NovelDetails
};