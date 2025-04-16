const novelModel = require('../models/novelModel');

const getHomePageData = async () => {
    const latestNovels = await novelModel.getLatestNovels();
    const popularNovels = await novelModel.getPopularNovels();
    const randomNovels = await novelModel.randomNovels();
    const allNovels = await novelModel.getAllNovels();
    

    // Gắn thêm trường Locked
    const markLocked = (novels) => {
        novels.forEach(novel => {
            novel.Locked = novel.locked === 1;
        });
        return novels;
    };

    return {
        randomNovels: markLocked(randomNovels),
        latestNovels: markLocked(latestNovels),
        popularNovels: markLocked(popularNovels),
        novels: markLocked(allNovels)
    };
};

const searchNovels = async (query) => {
    return await novelModel.searchNovelsByTitle(query);
};

const fetchAllNovelsWithLockStatus = async () => {
    const novels = await novelModel.getAllNovels();
    
    novels.forEach(novel => {
        novel.Locked = novel.locked === 1;
    });

    return novels;
};

const getNovelDetails = async (novelId, currentUserId) => {
    const novelRows = await novelModel.getNovelById(novelId);
    if (novelRows.length === 0) return null;

    const genreRows = await novelModel.getGenresByNovelId(novelId);
    const chapterRows = await novelModel.getChaptersByNovelId(novelId);

    const isAuthor = currentUserId === novelRows[0].AuthorID;

    return {
        novel: novelRows[0],
        genres: genreRows,
        chapters: chapterRows,
        isAuthor
    };
};

const createNovelReport = async (userID, novelID, reason) => {
    return novelModel.reportNovel(userID, novelID, reason);
};

const findNovels = async (title, author, genre, page = 1, limit = 10) => {
    try {
        // Gọi hàm model đã cập nhật để lấy dữ liệu với phân trang
        const { novels, totalCount } = await novelModel.findNovelsWithFilter(title, author, genre, page, limit);
        return { novels, totalCount };
    } catch (error) {
        console.error("Lỗi service findNovels:", error);
        throw error;
    }
};

const fetchAuthorsAndGenres = async () => {
    try {
        // Sử dụng các hàm hiện có để lấy danh sách tác giả và thể loại
        const authors = await novelModel.getAllAuthors(); // Giả sử đã có hàm này
        const genres = await novelModel.getAllGenres();   // Giả sử đã có hàm này
        return { authors, genres };
    } catch (error) {
        console.error("Lỗi service fetchAuthorsAndGenres:", error);
        throw error;
    }
};

async function updateNovel(data) {
    await novelModel.updateNovelInfo(data);
    await novelModel.deleteNovelGenres(data.novelID);
    await novelModel.insertNovelGenres(data.novelID, data.genres);
    return { success: true, message: "Cập nhật thành công!" };
}



async function lockNovel(novelID, locked) {
    const [result] = await novelModel.lockOrUnlockNovel(novelID, locked);
    if (result.affectedRows > 0) {
        return { success: true, message: locked ? "Khóa tiểu thuyết thành công!" : "Mở khóa tiểu thuyết thành công!" };
    } else {
        return { success: false, message: "Không tìm thấy tiểu thuyết!" };
    }
}

const deleteNovel = async (NovelID) => {
    return await novelModel.deleteNovelById(NovelID);
};

module.exports = {
    getHomePageData, searchNovels, fetchAllNovelsWithLockStatus,
    getNovelDetails, createNovelReport,
    findNovels, fetchAuthorsAndGenres, updateNovel, lockNovel,
    deleteNovel
};