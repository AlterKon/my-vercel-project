const transactionService = require("../../services/transactionService");

const TransactionHomePage = async (req, res) => {
    try {
        const [transactions] = await transactionService.fetchTransactions();
        res.render("admin/transactionManage", { transactions, currentUser: req.session.user });
    } catch (error) {
        console.error("Lỗi lấy danh sách giao dịch:", error);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
};

const UpdateTransactionStatus = async (req, res) => {
    try {
        const { transactionID } = req.params;
        const { status } = req.body;

        await transactionService.updateTransaction(transactionID, status);
        res.redirect("/admin/Transactions");
    } catch (error) {
        console.error("Lỗi khi cập nhật giao dịch:", error);
        res.status(500).json({ success: false, message: error.message || "Lỗi server!" });
    }
};

module.exports ={
    TransactionHomePage, UpdateTransactionStatus
}