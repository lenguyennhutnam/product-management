const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const { generateRandomNumber } = require("../../helpers/generate.helper");
const { sendMail } = require("../../helpers/sendMail.helper");

const generateHelper = require("../../helpers/generate.helper");

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (existUser) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: generateHelper.generateRandomString(30),
    };

    const user = new User(userData);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
};
// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
    });
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    if (md5(req.body.password) != user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if (user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
};
// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
};
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email, deleted: false });
    if (!user) {
        req.flash("error", "Email không tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }
    // Send otp
    const forgotPasswordData = {
        email: email,
        otp: generateRandomNumber(6),
        expireAt: Date.now() + 5 * 60 * 1000,
    };
    const forgotPassword = new ForgotPassword(forgotPasswordData);
    await forgotPassword.save();
    const subject = "Mã OTP lấy lại mật khẩu.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${forgotPasswordData.otp}</b>. Mã OTP có hiệu lực trong 5 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
    const result = sendMail("nlee2k3@gmail.com", subject, htmlSendMail);
    if (!result) {
        console.log("false");
    }
    res.redirect(`/user/password/otp?email=${email}`);
};
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        email: email,
        pageTitle: "Xác thực OTP",
    });
};
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const { email, otp } = req.body;
    const user = await ForgotPassword.findOne({ email: email, otp: otp });
    if (!user) {
        req.flash("error", "OTP không hợp lệ!");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
};
// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi lại mật khẩu",
    });
};
// [PATCH] /user/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
    // qcuk anor rrtb ntsy
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne(
        {
            tokenUser: tokenUser,
            deleted: false,
        },
        {
            password: md5(password),
        }
    );
    res.redirect("/");
};
// [GET] /user/info
module.exports.info = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser: tokenUser });
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin người dùng",
        user: user,
    });
};
