const { findUsersByName, deleteUserByID, getUserByID, updateUserByID } = require('../models/userModel');

const searchUsersByName = async (query) => {
    const searchQuery = query.trim() || "";
    return await findUsersByName(searchQuery);
};

const updateUser = async (userID, email, username, role, status) => {
    if (!userID || !email || !username || !role || !status) {
        throw new Error("Thiếu thông tin!");
    }

    const [result] = await updateUserByID(userID, email, username, role, status);

    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy user cần cập nhật!");
    }
};

const deleteUser = async (userID) => {
    if (!userID) throw new Error("Thiếu userID!");

    const [existingUser] = await getUserByID(userID);
    if (existingUser.length === 0) {
        throw new Error("Không tìm thấy tài khoản!");
    }

    if (existingUser[0].Role === "admin") {
        throw new Error("Không thể xóa tài khoản admin!");
    }

    const [result] = await deleteUserByID(userID);
    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy tài khoản!");
    }
};

module.exports = {
    searchUsersByName, updateUser, deleteUser
}