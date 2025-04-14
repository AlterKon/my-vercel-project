const pool = require('../config/database')

const getAllTransactions = () => {
    return pool.query(`
        SELECT t.TransactionID, t.Amount, t.Status, t.PaymentMethod, t.CreatedAt,
            t.ProofImage,
            u.Username AS UserName, 
            sp.PlanName AS PlanName
        FROM Transactions t
        LEFT JOIN Users u ON t.UserID = u.UserID
        LEFT JOIN SubscriptionPlans sp ON t.PlanID = sp.PlanID
        ORDER BY t.CreatedAt DESC;
    `);
};

const getTransactionByID = (transactionID) => {
    return pool.query("SELECT * FROM Transactions WHERE TransactionID = ?", [transactionID]);
};

const updateTransactionStatus = (status, transactionID) => {
    return pool.query("UPDATE Transactions SET Status = ? WHERE TransactionID = ?", [status, transactionID]);
};

const getPlanByID = (planID) => {
    return pool.query("SELECT MaxNovels FROM SubscriptionPlans WHERE PlanID = ?", [planID]);
};

const addUserSubscription = (userID, planID, maxNovels) => {
    return pool.query(`
        INSERT INTO UserSubscriptions (UserID, PlanID, RemainingNovels, CreatedAt, UpdatedAt)
        VALUES (?, ?, ?, NOW(), NOW())
    `, [userID, planID, maxNovels]);
};

module.exports = {
    getAllTransactions,
    getTransactionByID,
    updateTransactionStatus,
    getPlanByID,
    addUserSubscription,
};
