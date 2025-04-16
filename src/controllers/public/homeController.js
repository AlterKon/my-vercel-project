const novelService = require('../../services/novelService');
const discussionService = require('../../services/discussionService');
const HomePage = async (req, res) => {
    try {
        const { randomNovels, latestNovels, popularNovels, novels } = await novelService.getHomePageData();
        const {latestDiscussions} = await discussionService.getHomePageData();

        res.render("partials/layout", {
            content: '../public/home',
            title: "Trang Chủ",
            currentUser: req.session.user || null,
            randomNovels,
            latestNovels,
            popularNovels,
            novels,
            latestDiscussions
        });
    } catch (error) {
        console.error("Lỗi khi render trang chủ:", error);
        res.status(500).send("Lỗi máy chủ nội bộ");
    }
}

const FindNovels = async (req, res) => {
    const query = req.query.query;
    if (!query) return res.json([]);

    try {
        const results = await novelService.searchNovels(query);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
}

module.exports ={
    HomePage, FindNovels
}