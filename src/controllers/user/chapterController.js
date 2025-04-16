const chapterModel = require('../../models/chapterModel');
const chapterService = require('../../services/chapterService');

const AddChapterPage = async (req, res) => {
    try {
        const novelID = req.params.id;
        const novel = await chapterService.fetchNovelInfo(novelID);

        if (novel.AuthorID !== req.session.user.id) {
            return res.status(403).send("Bạn không có quyền thêm chương cho tiểu thuyết này.");
        }

        res.render('partials/layout', { 
            content: '../user/add-chapter', 
            novel,
            currentUser: res.locals.currentUser 
        });
    } catch (err) {
        console.error("Lỗi lấy thông tin tiểu thuyết:", err);
        res.status(err.status || 500).send(err.message || "Lỗi máy chủ");
    }
};
const AddNewChapter = async (req, res) => {
    try {
        const novelID = req.params.id;
        await chapterService.addChapter(novelID, req.body);

        res.redirect(`/novels/${novelID}`);
    } catch (err) {
        console.error("Lỗi thêm chương:", err);
        res.status(err.status || 500).send(err.message || "Lỗi máy chủ");
    }
};

const ChapterDetail = async (req, res) => {
    try {
        const { NovelID, ChapterNumber } = req.params;
        const userID = req.session.userID;

        const {
            novel,
            chapter,
            hasOwnership,
            isBookmarked
        } = await chapterService.getChapterDetailData(NovelID, parseInt(ChapterNumber), userID);

        res.render("partials/layout", {
            content: '../user/readChapter',
            user: req.session.user,
            novelID: NovelID,
            chapterNumber: ChapterNumber,
            novel,
            chapter,
            hasOwnership,
            isBookmarked
        });

    } catch (error) {
        console.error("Lỗi khi lấy chương:", error);
        res.status(error.status || 500).send(error.message || "Lỗi server!");
    }
};

const UpdateChapterPage = async (req, res) => {
    const { novelId, chapterNumber } = req.params;
    const currentUserId = req.session.user ? req.session.user.id : null;

    try {
        const [chapterRows] = await chapterModel.getChapterByNovelAndNumber(novelId, chapterNumber);
        if (chapterRows.length === 0) return res.status(404).send("Không tìm thấy chương.");
        const permission = await chapterService.canEditChapter(novelId, currentUserId);
        if (!permission.allowed) return res.status(403).send(permission.message);

        res.render('partials/layout', {
            content: '../user/edit_chapter',
            chapter: chapterRows[0],
            currentUser: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const UpdateChapter = async (req, res) => {
    const { novelId, chapterNumber } = req.params;
    const { title, content } = req.body;
    const currentUserId = req.session.user ? req.session.user.id : null;

    try {
        const permission = await chapterService.canEditChapter(novelId, currentUserId);
        if (!permission.allowed) return res.status(403).send(permission.message);

        await chapterModel.updateChapter(title, content, novelId, chapterNumber);
        res.redirect(`/novels/${novelId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const AddBookMark = async (req, res) => {
    try {

        console.log("Bookmark route called");
        const { novelID, chapterNumber } = req.body;
        const userID = req.session.userID;

        const [bookmark] = await chapterModel.getBookmark(userID, novelID);
        
        if (bookmark.length > 0) {
            await chapterModel.updateBookmark(chapterNumber, userID, novelID);
        } else {
            await chapterModel.insertBookmark(userID, novelID, chapterNumber);
        }

        res.json({ success: true, message: 'Đã đánh dấu chương này!', isBookmarked: true });
    } catch (error) {
        console.error("Lỗi khi xử lý bookmark:", error);
        res.status(500).json({ success: false, message: 'Lỗi server!' });
    }
};


module.exports = {
    AddChapterPage,
    AddNewChapter,
    ChapterDetail,
    UpdateChapterPage,
    UpdateChapter,
    AddBookMark
};
