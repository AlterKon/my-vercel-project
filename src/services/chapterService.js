const chapterModel = require('../models/chapterModel');

const fetchNovelInfo = async (novelID) => {
    const [novel] = await chapterModel.getNovelBasicInfo(novelID);
    if (novel.length === 0) {
        throw { status: 404, message: "Không tìm thấy tiểu thuyết!" };
    }
    return novel[0];
};

const addChapter = async (novelID, chapterData) => {
    const { ChapterNumber, Title, Content } = chapterData;

    if (!ChapterNumber || !Title || !Content) {
        throw { status: 400, message: "Vui lòng điền đầy đủ thông tin chương!" };
    }

    await chapterModel.insertNewChapter(novelID, ChapterNumber, Title, Content);
};

const getChapterDetailData = async (novelID, chapterNumber, userID) => {
    const [novel] = await chapterModel.getNovelWithTotalChapters(novelID);
    if (novel.length === 0) throw { status: 404, message: "Tiểu thuyết không tồn tại!" };

    const [chapter] = await chapterModel.getChapter(novelID, chapterNumber);
    if (chapter.length === 0) throw { status: 404, message: "Chương không tồn tại!" };

    await chapterModel.increaseNovelView(novelID);

    const [isAuthor] = await chapterModel.checkAuthorOwnership(userID, novelID);

    let hasOwnership = true;
    if (chapterNumber >= 5 && isAuthor.length === 0) {
        const [ownership] = await chapterModel.checkUserOwnership(userID, novelID);
        hasOwnership = ownership.length > 0;
    }

    const [bookmark] = await chapterModel.getBookmark(userID, novelID);
    const isBookmarked = bookmark.length > 0 && bookmark[0].ChapterNumber === parseInt(chapterNumber);

    return {
        novel: novel[0],
        chapter: chapter[0],
        hasOwnership,
        isBookmarked
    };
};

const canEditChapter = async (novelId, userId) => {
    const [novelRows] = await chapterModel.getAuthorByNovel(novelId);
    if (novelRows.length === 0) return { allowed: false, message: "Không tìm thấy tiểu thuyết." };
    if (novelRows[0].AuthorID !== userId) return { allowed: false, message: "Bạn không có quyền chỉnh sửa chương này." };
    return { allowed: true };
};

module.exports = {
    fetchNovelInfo, addChapter,
    getChapterDetailData,
    canEditChapter
};
