const transactionModel = require("../models/transactionModel");
const pool = require('../config/database');

const fetchTransactions = () => {
    return transactionModel.getAllTransactions();
};

const updateTransaction = async (transactionID, status) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [transactions] = await transactionModel.getTransactionByID(transactionID);
        if (transactions.length === 0) {
            throw new Error("Giao dịch không tồn tại!");
        }

        const transaction = transactions[0];

        if (transaction.Status !== 'pending') {
            throw new Error("Giao dịch đã xử lý, không thể thay đổi trạng thái!");
        }

        await transactionModel.updateTransactionStatus(status, transactionID);

        if (status === 'completed') {
            const [plans] = await transactionModel.getPlanByID(transaction.PlanID);
            if (plans.length === 0) {
                throw new Error("Gói đăng ký không hợp lệ!");
            }

            await transactionModel.addUserSubscription(transaction.UserID, transaction.PlanID, plans[0].MaxNovels);
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    fetchTransactions,
    updateTransaction,
};
