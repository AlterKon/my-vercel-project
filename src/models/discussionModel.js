const pool = require('../config/database');

const getDiscussionById = (discussionID) => {
    return pool.execute(`
        SELECT d.*, u.Username 
        FROM Discussions d
        JOIN Users u ON d.UserID = u.UserID
        WHERE d.DiscussionID = ?
    `, [discussionID]);
};

const getDiscussionComments = (discussionID) => {
    return pool.execute(`
        SELECT c.*, u.Username 
        FROM DiscussionComments c
        JOIN Users u ON c.UserID = u.UserID
        WHERE c.DiscussionID = ?
        ORDER BY c.CreatedAt ASC
    `, [discussionID]);
};

const getDiscussionLikeCount = (discussionID) => {
    return pool.execute(`
        SELECT COUNT(*) AS LikeCount FROM DiscussionLikes WHERE DiscussionID = ?
    `, [discussionID]);
};

const getLatestDiscussions = async () => {
    const [rows] = await pool.query("SELECT * FROM Discussions ORDER BY CreatedAt DESC LIMIT 5");
    return rows;
};

const getAllDiscussionsWithCounts = async () => {
    const [rows] = await pool.execute(`
        SELECT d.*, u.Username, 
               (SELECT COUNT(*) FROM DiscussionComments WHERE DiscussionID = d.DiscussionID) AS CommentCount,
               (SELECT COUNT(*) FROM DiscussionLikes WHERE DiscussionID = d.DiscussionID) AS LikeCount
        FROM Discussions d
        JOIN Users u ON d.UserID = u.UserID
        ORDER BY d.CreatedAt DESC
    `);
    return rows;
};

const insertDiscussion = (userID, title, content) => {
    return pool.execute(
        "INSERT INTO Discussions (UserID, Title, Content) VALUES (?, ?, ?)", 
        [userID, title, content]
    );
};

const likeDiscussion = (userID, discussionID) => {
    return pool.execute(
        "INSERT IGNORE INTO DiscussionLikes (UserID, DiscussionID) VALUES (?, ?)",
        [userID, discussionID]
    );
};

const commentDiscussion = (discussionID, userID, content) => {
    return pool.execute(
        "INSERT INTO DiscussionComments (DiscussionID, UserID, Content) VALUES (?, ?, ?)",
        [discussionID, userID, content]
    );
};

const reportDiscussion = (userID, discussionID, reason) => {
    return pool.execute(
        "INSERT INTO DiscussionReports (UserID, DiscussionID, Reason) VALUES (?, ?, ?)",
        [userID, discussionID, reason]
    );
};

const deleteDiscussionByID = (discussionID) => {
    return pool.query("DELETE FROM Discussions WHERE DiscussionID = ?", [discussionID]);
};

module.exports = {
    getLatestDiscussions, getAllDiscussionsWithCounts, insertDiscussion,
    getDiscussionById,
    getDiscussionComments,
    getDiscussionLikeCount,
    likeDiscussion, commentDiscussion, reportDiscussion,
    deleteDiscussionByID
}