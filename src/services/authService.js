const bcrypt = require('bcrypt');
const authModel = require('../models/authModel');

const loginUser = async (username, password) => {
    const user = await authModel.findUserByUsername(username);

    if (!user) {
        return { success: false, message: "Sai tài khoản hoặc mật khẩu!" };
    }

    if (user.Status === 'banned') {
        return { success: false, message: "Tài khoản của bạn đã bị khóa!" };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    if (!isPasswordCorrect) {
        return { success: false, message: "Sai tài khoản hoặc mật khẩu!" };
    }

    // Trả về dữ liệu user nếu thành công
    return {
        success: true,
        user: {
            id: user.UserID,
            username: user.Username,
            role: user.Role.trim().toLowerCase(),
            status: user.Status
        }
    };
};

const registerUser = async (username, email, password) => {
    const existingEmail = await authModel.findUserByEmail(email);
    if (existingEmail) {
        return { success: false, message: "Email đã được đăng ký!" };
    }

    const existingUsername = await authModel.findUserByUsername(username);
    if (existingUsername) {
        return { success: false, message: "Username đã tồn tại!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authModel.insertNewUser(username, email, hashedPassword);

    return { success: true };
};

module.exports = {
    loginUser, registerUser
};