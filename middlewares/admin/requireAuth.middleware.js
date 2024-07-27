const Account = require("../../models/account.model.js");
const Role = require("../../models/role.model.js");
const systemConfig = require("../../config/system.js");

module.exports.requireAuth = async (req, res, next) => {
    const { token } = req.cookies;
    const userAccount = await Account.findOne({
        token: token,
        deleted: false,
    }).select("fullName email phone avatar role_id status");
    if (!userAccount) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    const role = await Role.findOne({ _id: userAccount.role_id }).select(
        "title permissions status"
    );
    res.locals.user = userAccount;
    res.locals.role = role;
    next();
};
