const profileService = require("../../services/profileService");

const ProfileHomePage = (req, res) => {
    res.redirect(`/user/profile/${req.session.user.id}`);
}


const UserProfile = async (req, res) => {
    try {
        const userID = req.params.id;
        const profileData = await profileService.getUserProfileData(userID);

        if (!profileData) {
            return res.status(404).send("Không tìm thấy người dùng!");
        }

        res.render("partials/layout", {
            content: "../user/profile",
            ...profileData,
            currentUser: res.locals.currentUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const ChangePassword = async (req, res) => {
    const userID = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
    }

    try {
        await profileService.changePassword(userID, currentPassword, newPassword);
        res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Lỗi server!";
        res.status(status).json({ success: false, message });
    }
};

const NovelOwnLimit = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });
    }

    try {
        const userID = req.session.user.id;
        const result = await profileService.getNovelOwnLimit(userID);
        res.json(result);
    } catch (error) {
        console.error("Lỗi máy chủ:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
    }
};

const UserBuyPlans = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });
    }

    const userID = req.session.user.id;
    const { planId, paymentMethod } = req.body;
    const proofImage = req.file ? req.file.filename : null;

    try {
        const result = await profileService.buyReadingPlan(userID, planId, paymentMethod, proofImage);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

const AddNovelPage = async (req, res) => {
    try {
        const genres = await novelService.getGenres();
        res.render('partials/layout', {
            genres,
            content: '../user/upload_novel.ejs',
            currentUser: req.session.user
        });
    } catch (err) {
        res.status(500).send('Lỗi lấy danh sách thể loại');
    }
};

const AddNewNovel = async (req, res) => {
    try {
        const { title, description, genres, status } = req.body;
        const coverImage = req.file ? `/images/${req.file.filename}` : null;

        if (!title || !description || !coverImage) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");
        }

        await novelService.createNovel({ title, description, status, coverImage, genres }, req.session.user.id);
        res.redirect('/user/profile');
    } catch (err) {
        console.error("Lỗi khi đăng tải tiểu thuyết:", err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const ReadBookMark = async (req, res) => {
    const { NovelID } = req.params;
    const userID = req.session.userID;

    try {
        const chapterNumber = await bookmarkService.getBookmarkChapter(userID, NovelID);
        const redirectChapter = chapterNumber ? chapterNumber : 1;
        res.redirect(`/user/read/${NovelID}/chapter/${redirectChapter}`);
    } catch (error) {
        console.error('Lỗi khi truy xuất bookmark:', error);
        res.status(500).send('Lỗi server!');
    }
};

module.exports = {
    ProfileHomePage, UserProfile, ChangePassword, NovelOwnLimit,
    UserBuyPlans, AddNovelPage, AddNewNovel, ReadBookMark
}