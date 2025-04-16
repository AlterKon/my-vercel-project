const reportService = require("../../services/reportService");

const ReportHomePage = async (req, res) => {
    try {
        const { novelReports, discussionReports } = await reportService.fetchAllReports();
        res.render("admin/reportManage.ejs", {
            reports: novelReports,
            DiscussionReports: discussionReports,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error("Lỗi lấy báo cáo:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const ResolveReport = async (req, res) => {
    try {
        const { reportID, type } = req.params;

        const [result] = await reportService.resolveReportByType(reportID, type);

        if (result.affectedRows > 0) {
            return res.json({ success: true, message: "Báo cáo đã được xác nhận!" });
        } else {
            return res.status(404).json({ success: false, message: "Không tìm thấy báo cáo!" });
        }
    } catch (error) {
        console.error("Lỗi xác nhận báo cáo:", error.message);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

module.exports ={
    ReportHomePage, ResolveReport
}