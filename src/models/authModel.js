const pool = require('../config/database');

const findUserByUsername = async (username) => {
    const [rows] = await pool.query(
        "SELECT UserID, Username, Password, Role, Status FROM Users WHERE Username = ?",
        [username]
    );
    return rows[0];
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
    return rows[0];
};

const insertNewUser = async (username, email, hashedPassword) => {
    await pool.query(
        "INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );
};

module.exports = {
    findUserByUsername, findUserByEmail,
    insertNewUser
};