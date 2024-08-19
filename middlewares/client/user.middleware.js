const User = require("../../models/user.model");

module.exports.userInfor = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        if (user) {
            res.locals.user = user;
        }
    }

    next();
};
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect("/user/login");
        return;
    }
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
    });
    if (user) {
        res.locals.user = user;
    } else {
        res.redirect("/user/login");
        return;
    }

    next();
};
