const subscriptionModel = require("../models/subscriptionModel");

const fetchAllPlans = () => {
    return subscriptionModel.getAllPlans();
};

const createNewPlan = (PlanName, Price, MaxNovels, Description) => {
    return subscriptionModel.addNewPlan(PlanName, Price, MaxNovels, Description);
};

const modifyPlan = (PlanID, PlanName, Price, MaxNovels) => {
    return subscriptionModel.updatePlan(PlanID, PlanName, Price, MaxNovels);
};

const removePlan = (PlanID) => {
    return subscriptionModel.deletePlan(PlanID);
};

module.exports = {
    fetchAllPlans,
    createNewPlan,
    modifyPlan,
    removePlan,
};
