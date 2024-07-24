const Account = require("../models/account.model.js");
const systemConfig = require("../config/system");

module.exports.requireAuth = async (req, res, next) => {
    const { token } = req.cookies;
    const userAccount = await Account.findOne({ token: token, deleted: false });
    if (!userAccount) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    next();
};
