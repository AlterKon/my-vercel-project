const pool = require("../config/database");

const getUserById = (userID) => {
    return pool.query("SELECT UserID, Username, Email, Role, Status, CreatedAt FROM Users WHERE UserID = ?", [userID]);
};

const getOwnedNovels = (userID) => {
    return pool.query(`
        SELECT ul.NovelID, n.Title, n.CoverImage, ul.PurchasedAt
        FROM UserLibrary ul
        LEFT JOIN UserUploadLibrary uul ON ul.NovelID = uul.NovelID AND ul.UserID = uul.UserID
        INNER JOIN Novels n ON ul.NovelID = n.NovelID
        WHERE ul.UserID = ? AND uul.NovelID IS NULL;
    `, [userID]);
};

const getUploadedNovels = (userID) => {
    return pool.query(`
        SELECT n.NovelID, n.Title, n.CoverImage, n.CreatedAt,
               (SELECT COUNT(*) FROM Chapters c WHERE c.NovelID = n.NovelID) AS ChapterCount
        FROM Novels n
        JOIN UserUploadLibrary uul ON n.NovelID = uul.NovelID
        WHERE uul.UserID = ?;
    `, [userID]);
};

const getRemainingNovels = (userID) => {
    return pool.query(`
        SELECT SUM(us.RemainingNovels) AS TotalRemaining
        FROM UserSubscriptions us
        WHERE us.UserID = ?;
    `, [userID]);
};

const getBookmarks = (userID) => {
    return pool.query(`
        SELECT b.*, n.Title AS NovelTitle
        FROM Bookmarks b
        JOIN Novels n ON b.NovelID = n.NovelID
        WHERE b.UserID = ?;
    `, [userID]);
};

const getTransactions = (userID) => {
    return pool.query(`
        SELECT t.TransactionID, t.PlanID, t.Amount, t.Status, t.PaymentMethod, t.CreatedAt, p.PlanName
        FROM Transactions t
        JOIN SubscriptionPlans p ON t.PlanID = p.PlanID
        WHERE t.UserID = ?;
    `, [userID]);
};

const getAuthorIncome = () => {
    return pool.query(`
        SELECT 
            u.UserID AS AuthorID,
            u.Username AS AuthorName,
            COUNT(ul.NovelID) * 3000 AS TotalIncome
        FROM Users u
        JOIN Novels n ON u.UserID = n.AuthorID
        JOIN UserLibrary ul ON n.NovelID = ul.NovelID
        GROUP BY u.UserID, u.Username;
    `);
};

const getAllPlans = () => {
    return pool.query("SELECT * FROM SubscriptionPlans");
};

const getPasswordByUserId = async (userID) => {
    const [rows] = await pool.query("SELECT Password FROM Users WHERE UserID = ?", [userID]);
    return rows[0]; // trả về user (nếu có) hoặc undefined
};

// Cập nhật mật khẩu mới cho người dùng
const updatePassword = async (userID, hashedPassword) => {
    await pool.query("UPDATE Users SET Password = ? WHERE UserID = ?", [hashedPassword, userID]);
};

const getSubscriptionPlanById = (planId) => {
    return pool.query(`SELECT * FROM SubscriptionPlans WHERE PlanID = ?`, [planId]);
};

const createTransaction = (userID, planID, amount, paymentMethod, proofImage) => {
    return pool.query(`
        INSERT INTO Transactions (UserID, PlanID, Amount, Status, PaymentMethod, ProofImage)
        VALUES (?, ?, ?, 'pending', ?, ?)`,
        [userID, planID, amount, paymentMethod, proofImage]
    );
};

const getAllGenres = () => {
    return pool.query('SELECT * FROM Genres');
};

const insertNovel = (title, description, coverImage, authorID, status) => {
    return pool.query(
        "INSERT INTO Novels (Title, Description, CoverImage, AuthorID, Status) VALUES (?, ?, ?, ?, ?)",
        [title, description, coverImage, authorID, status]
    );
};

const insertNovelGenres = (novelID, genreID) => {
    return pool.query(
        "INSERT INTO NovelGenres (NovelID, GenreID) VALUES (?, ?)",
        [novelID, genreID]
    );
};

const getUserBookmark = (userID, novelID) => {
    return pool.query(
        'SELECT ChapterNumber FROM Bookmarks WHERE UserID = ? AND NovelID = ?',
        [userID, novelID]
    );
};

module.exports = {
    getUserById,
    getOwnedNovels,
    getUploadedNovels,
    getRemainingNovels,
    getBookmarks,
    getTransactions,
    getAuthorIncome,
    getAllPlans,
    getPasswordByUserId,
    updatePassword,
    getSubscriptionPlanById,
    createTransaction,
    getAllGenres,
    insertNovel,
    insertNovelGenres,
    getUserBookmark
};
