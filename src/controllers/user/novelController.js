const libraryService = require('../../services/libraryService');
const novelService = require('../../services/novelService');

const NovelReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userID = req.session.user?.id || req.session.userID;

        if (!userID) {
            return res.status(401).json({ success: false, message: "Bạn cần đăng nhập để báo cáo!" });
        }

        await novelService.createNovelReport(userID, id, reason);

        res.json({ success: true, message: "Báo cáo đã được gửi thành công!" });
    } catch (error) {
        console.error("Lỗi khi gửi báo cáo:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const AddNovelToLibrary = async (req, res) => {
    try {
        const userID = req.session.userID;
        const novelID = req.params.id;

        if (!userID) {
            return res.status(401).json({ success: false, error: "Bạn cần đăng nhập!" });
        }

        const result = await libraryService.addNovelToLibrary(userID, novelID);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ success: false, error: err.message || "Lỗi máy chủ" });
    }
};

module.exports ={
    NovelReport, AddNovelToLibrary
}