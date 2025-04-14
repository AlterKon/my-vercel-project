const genreService = require('../../services/genreService');

const GenreHomePage = async (req, res) => {
    try {
        const genres = await genreService.fetchAllGenres();
        res.render('partials/layout', {
            content: '../public/genres',
            genres,
            currentUser: req.session.user
        });
    } catch (err) {
        console.error("Lỗi khi load GenreHomePage:", err);
        res.status(500).send("Lỗi máy chủ");
    }
};

const GenreDetails = async (req, res) => {
    try {
        const genreID = req.params.id;
        const data = await genreService.fetchGenreDetails(genreID);

        if (!data) {
            return res.status(404).send("Không tìm thấy thể loại!");
        }

        res.render('partials/layout', {
            content: '../public/genre_details',
            genre: data.genre,
            novels: data.novels,
            currentUser: req.session.user
        });
    } catch (err) {
        console.error("Lỗi khi load GenreDetails:", err);
        res.status(500).send("Lỗi máy chủ");
    }
};

module.exports = {
    GenreHomePage,
    GenreDetails
};
