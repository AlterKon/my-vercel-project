const subscriptionService = require("../../services/subscriptionService");

const SubscriptionHomePage = async (req, res) => {
    try {
        const [plans] = await subscriptionService.fetchAllPlans();
        res.render("admin/subscriptionManage", { plans, currentUser: req.session.user });
    } catch (error) {
        console.error("Lỗi lấy danh sách gói đọc:", error);
        res.status(500).send("Lỗi server!");
    }
};

const AddNewSubscription = async (req, res) => {
    try {
        const { PlanName, Price, MaxNovels, Description } = req.body;
        await subscriptionService.createNewPlan(PlanName, Price, MaxNovels, Description);
        res.redirect("/Admin/SubscriptionPlans");
    } catch (error) {
        console.error("Lỗi thêm gói đọc:", error);
        res.status(500).send("Lỗi server!");
    }
};

const UpdateSubscription = async (req, res) => {
    try {
        const { PlanID, PlanName, Price, MaxNovels } = req.body;
        await subscriptionService.modifyPlan(PlanID, PlanName, Price, MaxNovels);
        res.redirect("/Admin/SubscriptionPlans");
    } catch (error) {
        console.error("Lỗi cập nhật gói đọc:", error);
        res.status(500).send("Lỗi server!");
    }
};

const DeleteSubscription = async (req, res) => {
    try {
        const { PlanID } = req.body;
        await subscriptionService.removePlan(PlanID);
        res.redirect("/Admin/SubscriptionPlans");
    } catch (error) {
        console.error("Lỗi xóa gói đọc:", error);
        res.status(500).send("Lỗi server!");
    }
};

module.exports = {
    SubscriptionHomePage,
    AddNewSubscription,
    UpdateSubscription,
    DeleteSubscription,
};
