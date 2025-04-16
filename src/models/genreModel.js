const pool = require('../config/database');

const getAllGenres = async () => {
    const [rows] = await pool.query("SELECT * FROM Genres");
    return rows;
};

const getGenreById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM Genres WHERE GenreID = ?", [id]);
    return rows;
};

const getNovelsByGenreId = async (genreID) => {
    const [rows] = await pool.query(`
        SELECT n.* FROM Novels n
        JOIN NovelGenres ng ON n.NovelID = ng.NovelID
        WHERE ng.GenreID = ?
    `, [genreID]);
    return rows;
};

const getAllGenresWithCount = async () => {
    const [genres] = await pool.execute(`
        SELECT
            g.GenreID,
            g.GenreName,
            g.Description,
            COUNT(ng.NovelID) AS NovelCount
        FROM Genres g
        LEFT JOIN NovelGenres ng ON g.GenreID = ng.GenreID
        GROUP BY g.GenreID, g.GenreName
        ORDER BY g.GenreID ASC
    `);
    return genres;
};

const insertNewGenre = async (GenreName, Description) => {
    const [results] = await pool.query(
        `INSERT INTO Genres (GenreName, Description) VALUES (?, ?);`,
        [GenreName, Description]
    );
    return results;
};

const updateGenreById = async (GenreID, GenreName, Description) => {
    const [results] = await pool.query(
        `
        UPDATE Genres
        SET GenreName = ?, Description = ?
        WHERE GenreID = ?;
        `,
        [GenreName, Description, GenreID]
    );
    return results;
};

const checkGenreHasNovels = async (GenreID) => {
    const [rows] = await pool.execute(
        "SELECT COUNT(*) as count FROM NovelGenres WHERE GenreID = ?",
        [GenreID]
    );
    return rows[0].count > 0; // true nếu có tiểu thuyết
};

const deleteGenreById = async (GenreID) => {
    const [result] = await pool.execute(
        "DELETE FROM Genres WHERE GenreID = ?",
        [GenreID]
    );
    return result;
};

module.exports = {
    getAllGenres,
    getGenreById,
    getNovelsByGenreId,
    getAllGenresWithCount,
    insertNewGenre,
    updateGenreById,
    checkGenreHasNovels,
    deleteGenreById
};