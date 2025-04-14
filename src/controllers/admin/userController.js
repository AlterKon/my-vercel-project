const userService = require('../../services/userService');
const authService = require("../../services/authService");

const FindByName = async (req, res) => {
    try {
        const query = req.query.query || "";
        const users = await userService.searchUsersByName(query);

        if (req.xhr || req.headers.accept.includes("application/json")) {
            return res.json(users);
        }

        res.render("admin/userManage.ejs", {
            listUsers: users,
            searchQuery: query,
            currentUser: req.session.user
        });
    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        res.status(500).json({ error: "Lỗi server!" });
    }
};

const AddNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        await authService.registerUser(username, email, password);
        res.redirect("/Admin/Users");
    } catch (error) {
        console.error("Lỗi khi tạo người dùng:", error);
        res.status(400).json({ message: error.message || "Lỗi server!" });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { userID, email, username, role, status } = req.body;
        await userService.updateUser(userID, email, username, role, status);
        res.redirect("/Admin/Users");
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const { userID } = req.body;
        await userService.deleteUser(userID);
        res.json({ success: true, message: "Xóa tài khoản thành công!" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    AddNewUser, UpdateUser, DeleteUser, FindByName
}