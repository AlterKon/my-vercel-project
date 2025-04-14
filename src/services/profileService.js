const profileModel = require("../models/profileModel");
const momoService = require('../services/momoService');

const getUserProfileData = async (userID) => {
    const [[user]] = await profileModel.getUserById(userID);
    if (!user) return null;

    const [ownedNovels] = await profileModel.getOwnedNovels(userID);
    const [uploadedNovels] = await profileModel.getUploadedNovels(userID);
    const [[subscription]] = await profileModel.getRemainingNovels(userID);
    const [bookmarks] = await profileModel.getBookmarks(userID);
    const [transactions] = await profileModel.getTransactions(userID);
    const [authorIncome] = await profileModel.getAuthorIncome();

    const totalOwned = ownedNovels.length;
    const totalCanOwn = subscription?.TotalRemaining || 0;

    let availablePlans = [];
    if (totalCanOwn < 1) {
        [availablePlans] = await profileModel.getAllPlans();
    }

    return {
        user,
        ownedNovels,
        uploadedNovels,
        totalOwned,
        totalCanOwn,
        availablePlans,
        bookmarks,
        transactions,
        authorIncome
    };
};

const changePassword = async (userID, currentPassword, newPassword) => {

    const user = await profileModel.getPasswordByUserId(userID);
    if (!user) {
        throw { status: 404, message: "Không tìm thấy người dùng!" };
    }

    const currentHashedPassword = user.Password;

    const isCurrentCorrect = await bcrypt.compare(currentPassword, currentHashedPassword);
    if (!isCurrentCorrect) {
        throw { status: 400, message: "Mật khẩu hiện tại không đúng!" };
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, currentHashedPassword);
    if (isSameAsCurrent) {
        throw { status: 400, message: "Mật khẩu mới không được trùng với mật khẩu hiện tại!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await profileModel.updatePassword(userID, hashedPassword);

    return true;
};

const getNovelOwnLimit = async (userID) => {
    const [rows] = await profileModel.getRemainingNovels(userID);
    const remainingNovels = rows[0]?.TotalRemaining || 0;
    return { success: true, remainingNovels };
};

const buyReadingPlan = async (userID, planId, paymentMethod, proofImage) => {
    const [plan] = await profileModel.getSubscriptionPlanById(planId);
    if (plan.length === 0) {
        throw new Error("Gói đọc không hợp lệ!");
    }

    await profileModel.createTransaction(userID, plan[0].PlanID, plan[0].Price, paymentMethod, proofImage);

    return {
        success: true,
        message: "Giao dịch đang được xử lý. Vui lòng chờ xác nhận!"
    };
};

const getGenres = async () => {
    const [genres] = await novelModel.getAllGenres();
    return genres;
};

const createNovel = async (data, userID) => {
    const { title, description, status, coverImage, genres } = data;
    const [result] = await novelModel.insertNovel(title, description, coverImage, userID, status);
    const novelID = result.insertId;

    if (Array.isArray(genres)) {
        for (let genreID of genres) {
            await novelModel.insertNovelGenres(novelID, genreID);
        }
    }

    return novelID;
};

const getBookmarkChapter = async (userID, novelID) => {
    const [bookmark] = await bookmarkModel.getUserBookmark(userID, novelID);
    if (bookmark.length > 0) {
        return bookmark[0].ChapterNumber;
    }
    return null; // Không có bookmark
};

module.exports = {
    getUserProfileData, changePassword, getNovelOwnLimit, buyReadingPlan,
    getGenres, createNovel, getBookmarkChapter
};
