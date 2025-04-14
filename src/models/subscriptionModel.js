const pool = require("../config/database");

const getAllPlans = () => {
    return pool.query("SELECT * FROM SubscriptionPlans ORDER BY PlanID ASC");
};

const addNewPlan = (PlanName, Price, MaxNovels, Description) => {
    return pool.query(
        "INSERT INTO SubscriptionPlans (PlanName, Price, MaxNovels, Description) VALUES (?, ?, ?, ?)",
        [PlanName, Price, MaxNovels, Description]
    );
};

const updatePlan = (PlanID, PlanName, Price, MaxNovels) => {
    return pool.query(
        "UPDATE SubscriptionPlans SET PlanName = ?, Price = ?, MaxNovels = ? WHERE PlanID = ?",
        [PlanName, Price, MaxNovels, PlanID]
    );
};

const deletePlan = (PlanID) => {
    return pool.query("DELETE FROM SubscriptionPlans WHERE PlanID = ?", [PlanID]);
};

module.exports = {
    getAllPlans,
    addNewPlan,
    updatePlan,
    deletePlan,
};
