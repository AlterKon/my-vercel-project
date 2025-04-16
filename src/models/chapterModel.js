const pool = require('../config/database');

const getNovelBasicInfo = (novelID) => {
    return pool.query(
        `SELECT NovelID, Title, AuthorID FROM Novels WHERE NovelID = ?`, 
        [novelID]
    );
};

const insertNewChapter = (novelID, ChapterNumber, Title, Content) => {
    return pool.query(`
        INSERT INTO Chapters (NovelID, ChapterNumber, Title, Content) 
        VALUES (?, ?, ?, ?)`, 
        [novelID, ChapterNumber, Title, Content]
    );
};

const getNovelWithTotalChapters = (novelID) => {
    return pool.execute(`
        SELECT Novels.*,
               (SELECT COUNT(*) FROM Chapters WHERE NovelID = ?) AS TotalChapters
        FROM Novels WHERE NovelID = ?`,
        [novelID, novelID]
    );
};

const getChapter = (novelID, chapterNumber) => {
    return pool.execute(`
        SELECT * FROM Chapters WHERE NovelID = ? AND ChapterNumber = ?`,
        [novelID, chapterNumber]
    );
};

const increaseNovelView = (novelID) => {
    return pool.execute(`UPDATE Novels SET Views = Views + 1 WHERE NovelID = ?`, [novelID]);
};

const checkAuthorOwnership = (userID, novelID) => {
    return pool.execute(`
        SELECT * FROM UserUploadLibrary WHERE UserID = ? AND NovelID = ?`,
        [userID, novelID]
    );
};

const checkUserOwnership = (userID, novelID) => {
    return pool.execute(`
        SELECT * FROM UserLibrary WHERE UserID = ? AND NovelID = ?`,
        [userID, novelID]
    );
};

const getBookmark = (userID, novelID) => {
    return pool.execute(`
        SELECT * FROM Bookmarks WHERE UserID = ? AND NovelID = ?`,
        [userID, novelID]
    );
};

const getChapterByNovelAndNumber = (novelId, chapterNumber) => {
    return pool.query(`SELECT * FROM Chapters WHERE NovelID = ? AND ChapterNumber = ?`, [novelId, chapterNumber]);
};

const getAuthorByNovel = (novelId) => {
    return pool.query(`SELECT AuthorID FROM Novels WHERE NovelID = ?`, [novelId]);
};

const updateChapter = (title, content, novelId, chapterNumber) => {
    return pool.query(`UPDATE Chapters SET Title = ?, Content = ? WHERE NovelID = ? AND ChapterNumber = ?`, [title, content, novelId, chapterNumber]);
};

const updateBookmark = (chapterNumber, userID, novelID) => {
    return pool.query(`
        UPDATE Bookmarks 
        SET ChapterNumber = ?, CreatedAt = NOW() 
        WHERE UserID = ? AND NovelID = ?`,
        [chapterNumber, userID, novelID]
    );
};

const insertBookmark = (userID, novelID, chapterNumber) => {
    return pool.query(`
        INSERT INTO Bookmarks (UserID, NovelID, ChapterNumber, CreatedAt) 
        VALUES (?, ?, ?, NOW())`,
        [userID, novelID, chapterNumber]
    );
};

module.exports = {
    getNovelBasicInfo, insertNewChapter,
    getNovelWithTotalChapters, getChapter, increaseNovelView, checkAuthorOwnership, checkUserOwnership, getBookmark,
    getChapterByNovelAndNumber, getAuthorByNovel, updateChapter,
    updateBookmark, insertBookmark
};
