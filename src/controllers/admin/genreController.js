const genreService = require("../../services/genreService");

const GenresHomePage = async (req, res) => {
    try {
        const genres = await genreService.fetchGenresWithNovelCount();
        res.render("admin/genresManage.ejs", { genres, currentUser: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server!");
    }
};

const AddNewGenre = async (req, res) => {
    try {
        const { GenreName, Description } = req.body;
        if (!GenreName || !Description) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
        }
        await genreService.createNewGenre(GenreName, Description);
        res.redirect("/Admin/Genres");
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const UpdateGenre = async (req, res) => {
    try {
        const { GenreID, GenreName, Description } = req.body;
        if (!GenreID || !GenreName || !Description) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
        }

        await genreService.updateGenre(GenreID, GenreName, Description);
        res.redirect("/Admin/Genres");

    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const DeleteGenre = async (req, res) => {
    try {
        const { GenreID } = req.body;
        if (!GenreID) {
            return res.status(400).json({ success: false, message: "Thiếu GenreID!" });
        }

        const result = await genreService.deleteGenre(GenreID);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Xóa thể loại thành công!" });
        } else {
            res.status(404).json({ success: false, message: "Không tìm thấy thể loại!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

module.exports ={
    GenresHomePage, AddNewGenre, UpdateGenre, DeleteGenre
}