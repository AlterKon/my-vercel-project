const pool = require('../config/database');

const checkIfNovelExists = (novelID) => {
    return pool.query(`SELECT AuthorID FROM Novels WHERE NovelID = ?`, [novelID]);
};

const checkIfUserOwnsNovel = (userID, novelID) => {
    return pool.query(`SELECT * FROM UserLibrary WHERE UserID = ? AND NovelID = ?`, [userID, novelID]);
};

const getUserSubscription = (userID) => {
    return pool.query(`
        SELECT RemainingNovels 
        FROM UserSubscriptions 
        WHERE UserID = ? AND RemainingNovels > 0 
        ORDER BY RemainingNovels ASC 
        LIMIT 1`, [userID]);
};

const updateRemainingNovels = (userID) => {
    return pool.query(`
        UPDATE UserSubscriptions 
        SET RemainingNovels = RemainingNovels - 1 
        WHERE UserID = ? AND RemainingNovels > 0 
        ORDER BY RemainingNovels ASC 
        LIMIT 1`, [userID]);
};

const insertToUserLibrary = (userID, novelID) => {
    return pool.query(`
        INSERT INTO UserLibrary (UserID, NovelID, PurchasedAt)
        VALUES (?, ?, NOW())`, [userID, novelID]);
};

module.exports = {
    checkIfNovelExists,
    checkIfUserOwnsNovel,
    getUserSubscription,
    updateRemainingNovels,
    insertToUserLibrary
};
