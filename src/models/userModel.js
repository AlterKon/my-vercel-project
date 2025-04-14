const pool = require("../config/database");

const findUsersByName = async (query) => {
    if (query.trim() === "") {
        const [rows] = await pool.query("SELECT * FROM Users");
        return rows;
    } else {
        const sql = "SELECT * FROM Users WHERE Username LIKE ?";
        const [rows] = await pool.query(sql, [`%${query}%`]);
        return rows;
    }
};

const updateUserByID = async (userID, email, username, role, status) => {
    return pool.query(
        `
        UPDATE Users 
        SET Email = ?, Username = ?, Role = ?, Status = ?
        WHERE UserID = ?
        `,
        [email, username, role, status, userID]
    );
};

const deleteUserByID = async (userID) => {
    return pool.query("DELETE FROM Users WHERE UserID = ?", [userID]);
};

const getUserByID = async (userID) => {
    return pool.query("SELECT * FROM Users WHERE UserID = ?", [userID]);
};

module.exports = {
    findUsersByName, deleteUserByID, getUserByID, updateUserByID
};