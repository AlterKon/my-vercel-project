const pool = require("../config/database");

const getAllNovelReports = () => {
    return pool.query(`
        SELECT r.ReportID, r.Reason, r.Status, r.CreatedAt,
               u.Username AS Reporter,
               n.Title AS NovelTitle
        FROM Reports r
        LEFT JOIN Users u ON r.UserID = u.UserID
        LEFT JOIN Novels n ON r.NovelID = n.NovelID
        ORDER BY r.CreatedAt DESC
    `);
};

const getAllDiscussionReports = () => {
    return pool.query(`
        SELECT r.ReportID, r.Reason, r.Status, r.CreatedAt,
               u.Username AS Reporter,
               d.Title AS DiscussionTitle
        FROM DiscussionReports r
        LEFT JOIN Users u ON r.UserID = u.UserID
        LEFT JOIN Discussions d ON r.DiscussionID = d.DiscussionID
        ORDER BY r.CreatedAt DESC
    `);
};

const resolveNovelReport = (reportID) => {
    return pool.query("UPDATE Reports SET Status = 'resolved' WHERE ReportID = ?", [reportID]);
};

const resolveDiscussionReport = (reportID) => {
    return pool.query("UPDATE DiscussionReports SET Status = 'resolved' WHERE ReportID = ?", [reportID]);
};

module.exports = {
    getAllNovelReports,
    getAllDiscussionReports,
    resolveNovelReport,
    resolveDiscussionReport,
};
