const discussionService = require('../../services/discussionService');

const DiscussionHomePage = async (req, res) => {
    try {
        const discussions = await discussionService.fetchAllDiscussions();

        res.render("partials/layout", {
            content: '../public/discussions',
            discussions,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thảo luận:", error);
        res.status(500).send("Lỗi server!");
    }
};

module.exports = {DiscussionHomePage}