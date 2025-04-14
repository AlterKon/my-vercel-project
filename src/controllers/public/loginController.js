const authService = require('../../services/authService');

const LoginPage = (req, res) => {
    res.render('public/login', { error: null, currentUser: res.locals.currentUser });
};

const CheckAccount = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await authService.loginUser(username, password);

        if (!result.success) {
            return res.render("public/login", { error: result.message, currentUser: null });
        }

        req.session.userID = result.user.id;
        req.session.user = result.user;

        res.locals.currentUser = result.user;

        res.redirect("/");
    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        res.status(500).send("Lỗi máy chủ");
    }
};

module.exports = {
    LoginPage,
    CheckAccount
};