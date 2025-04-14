const discussionModel = require('../../models/discussionModel');
const discussionService = require('../../services/discussionService');

const AddDiscussionPage = (req, res) => {
    res.render("partials/layout",{content: '../user/discussion_new'});
}

const AddDiscussion = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userID = req.session.userID;

        const validation = discussionService.validateDiscussionInput(title, content);
        if (!validation.valid) {
            return res.status(400).send(validation.message);
        }

        await discussionModel.insertDiscussion(userID, title, content);

        res.redirect("/discussions");
    } catch (error) {
        console.error("Lỗi khi tạo bài thảo luận:", error);
        res.status(500).send("Lỗi server!");
    }
};

const DiscussionDetail = async (req, res) => {
    try {
        const { DiscussionID } = req.params;

        const validation = discussionService.validateDiscussionID(DiscussionID);
        if (!validation.valid) {
            return res.status(400).send(validation.message);
        }
        const discussionID = validation.id;

        const [discussion] = await discussionModel.getDiscussionById(discussionID);
        if (discussion.length === 0) {
            return res.status(404).send("Bài thảo luận không tồn tại!");
        }

        const [comments] = await discussionModel.getDiscussionComments(discussionID);
        const [likes] = await discussionModel.getDiscussionLikeCount(discussionID);

        res.render("partials/layout", {
            content: '../user/discussions_detail',
            discussion: discussion[0],
            comments,
            likeCount: likes[0].LikeCount
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài thảo luận:", error);
        res.status(500).send("Lỗi server!");
    }
};

const DiscussionLike = async (req, res) => {
    try {
        const { DiscussionID } = req.params;
        const userID = req.session.userID;

        await discussionModel.likeDiscussion(userID, DiscussionID);
        res.sendStatus(200);
    } catch (error) {
        console.error("Lỗi khi thích bài thảo luận:", error);
        res.status(500).send("Lỗi server!");
    }
};

const DiscussionComment = async (req, res) => {
    try {
        const { DiscussionID } = req.params;
        const { content } = req.body;
        const userID = req.session.userID;

        const validation = discussionService.validateCommentContent(content);
        if (!validation.valid) {
            return res.status(400).send(validation.message);
        }

        await discussionModel.commentDiscussion(DiscussionID, userID, content);
        res.sendStatus(200);
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        res.status(500).send("Lỗi server!");
    }
};

const DiscussionReport = async (req, res) => {
    try {
        const { DiscussionID } = req.params;
        const { reason } = req.body;
        const userID = req.session.userID;

        await discussionModel.reportDiscussion(userID, DiscussionID, reason);
        res.json({ message: "Báo cáo đã được gửi thành công!" });
    } catch (error) {
        console.error("Lỗi khi báo cáo bài thảo luận:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

module.exports = {
    AddDiscussionPage, AddDiscussion, DiscussionDetail, DiscussionLike, DiscussionComment, DiscussionReport
}