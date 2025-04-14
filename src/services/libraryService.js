const libraryModel = require('../models/libraryModel');

const addNovelToLibrary = async (userID, novelID) => {
    const [novel] = await libraryModel.checkIfNovelExists(novelID);
    if (novel.length === 0) {
        throw { status: 404, message: "Không tìm thấy tiểu thuyết!" };
    }

    const isAuthor = novel[0].AuthorID === userID;

    const [existing] = await libraryModel.checkIfUserOwnsNovel(userID, novelID);
    if (existing.length > 0) {
        throw { status: 400, message: "Tiểu thuyết đã có trong thư viện!" };
    }

    if (!isAuthor) {
        const [subscription] = await libraryModel.getUserSubscription(userID);
        const totalCanOwn = subscription.length > 0 ? subscription[0].RemainingNovels : 0;

        if (totalCanOwn < 1) {
            throw { status: 400, message: "Bạn đã đạt giới hạn sở hữu! Hãy mua thêm gói." };
        }

        await libraryModel.updateRemainingNovels(userID);
    }

    await libraryModel.insertToUserLibrary(userID, novelID);

    return { success: true, message: "Đã lưu vào thư viện!" };
};

module.exports = {
    addNovelToLibrary
};
