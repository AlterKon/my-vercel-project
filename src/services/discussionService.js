const discussionModel = require('../models/discussionModel');

const getHomePageData = async() =>{
    const latestDiscussions = await discussionModel.getLatestDiscussions();

    return{
        latestDiscussions
    };
}

const validateDiscussionID = (id) => {
    const discussionID = parseInt(id, 10);
    if (isNaN(discussionID)) {
        return { valid: false, message: "ID bài thảo luận không hợp lệ!" };
    }
    return { valid: true, id: discussionID };
};

const fetchAllDiscussions = async () => {
    return await discussionModel.getAllDiscussionsWithCounts();
};

const validateDiscussionInput = (title, content) => {
    if (!title || !content) {
        return { valid: false, message: "Vui lòng nhập đầy đủ tiêu đề và nội dung!" };
    }
    return { valid: true };
};

const validateCommentContent = (content) => {
    if (!content || content.trim() === '') {
        return { valid: false, message: "Nội dung không được để trống!" };
    }
    return { valid: true };
};

const removeDiscussion = (discussionID) => {
    return discussionModel.deleteDiscussionByID(discussionID);
};

module.exports = {
    getHomePageData, fetchAllDiscussions, validateDiscussionInput, validateDiscussionID,validateCommentContent, removeDiscussion
}