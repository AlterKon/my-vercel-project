const discussionService = require("../../services/discussionService");

const DiscussionHomePage = async (req, res) => {
    try {
        const discussions = await discussionService.fetchAllDiscussions();
        res.render("admin/discussionManage.ejs", { discussions, currentUser: req.session.user });
    } catch (error) {
        console.error("Lỗi lấy danh sách thảo luận:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const DeleteDiscussion = async (req, res) => {
    try {
        const { discussionID } = req.params;
        await discussionService.removeDiscussion(discussionID);
        res.json({ success: true, message: "Đã xóa bài thảo luận!" });
    } catch (error) {
        console.error("Lỗi xóa bài thảo luận:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

module.exports ={
    DiscussionHomePage, DeleteDiscussion
}