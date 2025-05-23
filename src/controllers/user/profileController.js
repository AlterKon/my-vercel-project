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
    try {
      const userID = req.session.user.id;
      const { remainingNovels } = await profileService.getNovelOwnLimit(userID);
  
      res.json({
        success: true,
        remainingNovels: remainingNovels || 0
      });
    } catch (error) {
      console.error("Lỗi máy chủ:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi kiểm tra lượt sở hữu."
      });
    }
};

const UserBuyPlans = async (req, res) => {
    try {
        const { planId, paymentMethod, transactionId } = req.body;
        const userID = req.session.user.id;
        const proofImage = req.file ? req.file.path : null;
    
        await profileService.createTransaction(userID, planId, paymentMethod, transactionId, proofImage);
        res.status(200).json({ message: 'Giao dịch đã được tạo. Chờ xác nhận!' });
      } catch (error) {
        console.error("Lỗi khi mua gói:", error);
        res.status(500).json({ message: 'Lỗi khi xử lý giao dịch' });
      }
};

const AddNovelPage = async (req, res) => {
    try {
        let genres = await profileService.getGenres();
        
        if (genres && !Array.isArray(genres)) {
            if (genres.rows) {
                genres = genres.rows;
            } else {
                genres = Object.values(genres);
            }
        }
        
        res.render('partials/layout', {
            genres,
            content: '../user/upload_novel.ejs',
            currentUser: req.session.user
        });
    } catch (err) {
        console.error("Error in AddNovelPage:", err);
        res.status(500).send('Lỗi lấy danh sách thể loại');
    }
};

const AddNewNovel = async (req, res) => {
    try {
        const { title, description, genres, status } = req.body;
        const coverImage = req.file ? req.file.path : null;

        if (!title || !description || !coverImage) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");
        }

        await profileService.createNovel({ title, description, status, coverImage, genres }, req.session.user.id);
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
        const chapterNumber = await profileService.getBookmarkChapter(userID, NovelID);
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