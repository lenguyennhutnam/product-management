const User = require("../../models/user.model");

module.exports.userInfor = (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        if (user) {
            res.locals.user = user;
        }
    }

    next();
};
