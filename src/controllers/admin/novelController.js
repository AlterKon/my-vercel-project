const novelService = require("../../services/novelService");

const FindNovels = async (req, res) => {
    try {
        const { title, author, genre } = req.query;
        const novels = await novelService.findNovels(title, author, genre);

        if (req.xhr || req.headers.accept.includes("application/json")) {
            return res.json(novels);
        }

        const { authors, genres } = await novelService.fetchAuthorsAndGenres();

        res.render("admin/novelManage.ejs", { 
            novels, 
            authors, 
            genres, 
            title, 
            author, 
            genre, 
            currentUser: req.session.user 
        });
    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        res.status(500).json({ error: "Lỗi server! Không thể lấy dữ liệu." });
    }
};

const UpdateNovel = async (req, res) => {
    try {
        let { novelID, title, description, coverImage, authorID, status, genres } = req.body;

        if (typeof genres === "string") {
            genres = genres.split(",").map(id => id.trim());
        }

        if (!Array.isArray(genres)) {
            genres = [];
        }

        await novelService.updateNovel({ novelID, title, description, coverImage, authorID, status, genres });

        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (error) {
        console.error("Lỗi khi cập nhật tiểu thuyết:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const LockNovel = async (req, res) => {
    try {
        const { novelID, locked } = req.body;

        if (novelID === undefined || locked === undefined) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
        }

        const result = await novelService.lockNovel(novelID, locked);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const DeleteNovel = async (req, res) => {
    try {
        const { NovelID } = req.body;
        if (!NovelID) {
            return res.status(400).json({ success: false, message: "Thiếu NovelID!" });
        }

        const result = await novelService.deleteGenre(NovelID);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Xóa tiểu thuyết thành công!" });
        } else {
            res.status(404).json({ success: false, message: "Không tìm thấy tiểu thuyết!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

module.exports ={
    FindNovels, UpdateNovel, LockNovel, DeleteNovel
}