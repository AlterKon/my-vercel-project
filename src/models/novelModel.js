const pool = require('../config/database');

const getLatestNovels = async () => {
    const [rows] = await pool.query("SELECT * FROM Novels ORDER BY CreatedAt DESC LIMIT 6");
    return rows;
};

const getPopularNovels = async () => {
    const [rows] = await pool.query("SELECT * FROM Novels ORDER BY Views DESC LIMIT 4");
    return rows;
};

const getAllNovels = async () => {
    const [rows] = await pool.query("SELECT * FROM Novels");
    return rows;
};

const searchNovelsByTitle = async (query) => {
    const [rows] = await pool.query(
        "SELECT NovelID, Title FROM Novels WHERE Title LIKE ? LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};

const getNovelById = async (novelId) => {
    const [rows] = await pool.query(
        `SELECT Novels.*, Users.Username AS AuthorName 
        FROM Novels 
        LEFT JOIN Users ON Novels.AuthorID = Users.UserID 
        WHERE Novels.NovelID = ?`,
        [novelId]
    );
    return rows;
};

const getGenresByNovelId = async (novelId) => {
    const [rows] = await pool.query(
        `SELECT Genres.GenreName, Genres.GenreID
        FROM Genres 
        JOIN NovelGenres ON Genres.GenreID = NovelGenres.GenreID 
        WHERE NovelGenres.NovelID = ?`,
        [novelId]
    );
    return rows;
};

const getChaptersByNovelId = async (novelId) => {
    const [rows] = await pool.query(
        `SELECT ChapterID, ChapterNumber, Title 
        FROM Chapters 
        WHERE NovelID = ? 
        ORDER BY ChapterNumber ASC`,
        [novelId]
    );
    return rows;
};

const reportNovel = (userID, novelID, reason) => {
    return pool.execute(
        "INSERT INTO Reports (UserID, NovelID, Reason, Status) VALUES (?, ?, ?, 'pending')",
        [userID, novelID, reason]
    );
};


async function findNovelsWithFilter(title, author, genre) {
    let sql = `
        SELECT 
            n.NovelID, 
            n.Title, 
            n.Description, 
            n.CoverImage, 
            u.Username AS AuthorName, 
            u.UserID AS AuthorID, 
            n.Status, 
            n.Views, 
            n.CreatedAt, 
            COUNT(DISTINCT c.ChapterID) AS ChapterCount, 
            n.Locked,
            IFNULL(GROUP_CONCAT(DISTINCT g.GenreName ORDER BY g.GenreName SEPARATOR ', '), '') AS Genres
        FROM Novels n
        LEFT JOIN Users u ON n.AuthorID = u.UserID
        LEFT JOIN Chapters c ON n.NovelID = c.NovelID
        LEFT JOIN NovelGenres ng ON n.NovelID = ng.NovelID
        LEFT JOIN Genres g ON ng.GenreID = g.GenreID
        WHERE 1=1
    `;

    const params = [];

    if (title) {
        sql += " AND n.Title LIKE ?";
        params.push(`%${title}%`);
    }

    if (author) {
        sql += " AND u.UserID = ?";
        params.push(author);
    }

    if (genre) {
        sql += " AND g.GenreID = ?";
        params.push(genre);
    }

    sql += " GROUP BY n.NovelID";

    const [novels] = await pool.query(sql, params);
    return novels;
}

async function getAllAuthors() {
    const [authors] = await pool.query("SELECT UserID, Username FROM Users");
    return authors;
}

async function getAllGenres() {
    const [genres] = await pool.query("SELECT GenreID, GenreName FROM Genres");
    return genres;
}

async function updateNovelInfo({ novelID, title, description, coverImage, authorID, status }) {
    return await pool.execute(
        `UPDATE Novels SET Title = ?, Description = ?, CoverImage = ?, AuthorID = ?, Status = ? WHERE NovelID = ?`,
        [title, description, coverImage, authorID, status, novelID]
    );
}

async function deleteNovelGenres(novelID) {
    return await pool.execute(`DELETE FROM NovelGenres WHERE NovelID = ?`, [novelID]);
}

async function insertNovelGenres(novelID, genreIDs) {
    if (!Array.isArray(genreIDs) || genreIDs.length === 0) return;
    const values = genreIDs.map(genreID => `(${novelID}, ${genreID})`).join(",");
    const sql = `INSERT INTO NovelGenres (NovelID, GenreID) VALUES ${values}`;
    return await pool.execute(sql);
}

async function lockOrUnlockNovel(novelID, locked) {
    return await pool.execute(`UPDATE Novels SET Locked = ? WHERE NovelID = ?`, [locked, novelID]);
}

const deleteNovelById = async (NovelID) => {
    const [result] = await pool.execute(
        "DELETE FROM Novels WHERE NovelID = ?",
        [NovelID]
    );
    return result;
};

module.exports = {
    getLatestNovels, getPopularNovels ,getAllNovels,
    searchNovelsByTitle, 
    getNovelById, getGenresByNovelId, getChaptersByNovelId,
    reportNovel,
    findNovelsWithFilter, getAllAuthors, getAllGenres,
    updateNovelInfo, deleteNovelGenres, insertNovelGenres, lockOrUnlockNovel,
    deleteNovelById
};