const reportModel = require("../models/reportModel");

const fetchAllReports = async () => {
    const [novelReports] = await reportModel.getAllNovelReports();
    const [discussionReports] = await reportModel.getAllDiscussionReports();
    return { novelReports, discussionReports };
};

const resolveReportByType = async (reportID, type) => {
    if (type === "novel") {
        return reportModel.resolveNovelReport(reportID);
    } else if (type === "discussion") {
        return reportModel.resolveDiscussionReport(reportID);
    } else {
        throw new Error("Loại báo cáo không hợp lệ");
    }
};

module.exports = {
    fetchAllReports,
    resolveReportByType,
};
