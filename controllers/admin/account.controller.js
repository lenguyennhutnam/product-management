const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false,
    }).lean();

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });

        record.roleTitle = role.title;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Tài khoản admin",
        records: records,
    });
};
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    }).select("title");

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo tài khoản admin",
        roles: roles,
    });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_create")) {
        req.body.password = md5(req.body.password);

        req.body.token = generateHelper.generateRandomString(30);
        try {
            const account = new Account(req.body);
            await account.save();
            res.json({ code: 200, msg: "Tạo tài khoản mới thành công!" });
        } catch {
            res.json({ code: 500, msg: "Lỗi" });
        }
    }
};
// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        let account = await Account.findOne({ _id: id, deleted: false }).lean();
        const role = await Role.findOne({
            _id: account.role_id,
        }).lean();
        account.roleName = role.title;
        res.render("admin/pages/accounts/detail", {
            account: account,
        });
    } catch {
        res.redirect("back");
    }
};
// [PATCH] /admin/accounts/change-status/:id
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const changeAccount = await Account.findOne({ _id: req.params.id });
            const newStatus =
                changeAccount.status == "active" ? "inactive" : "active";
            await Account.updateOne(
                { _id: req.params.id },
                { status: newStatus }
            );
            res.json({
                code: 200,
                oldStatus:
                    changeAccount.status == "active"
                        ? "btn-success"
                        : "btn-danger",
                newStatus: newStatus == "active" ? "btn-success" : "btn-danger",
                text: newStatus == "active" ? "Hoạt động" : "Ngừng hoạt động",
            });
        } catch (err) {
            res.redirect("back");
        }
    }
};
// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const account = await Account.findOne({
            _id: id,
            deleted: false,
        });
        const roles = await Role.find({
            deleted: false,
        }).select("title");

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chinh sửa tài khoản admin",
            roles: roles,
            account: account,
        });
    } catch {
        res.redirect("back");
    }
};
// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        const id = req.params.id;
        if (id) {
            if (req.body.password == "") {
                delete req.body.password;
            } else {
                req.body.password = md5(req.body.password);
            }
            await Account.updateOne(
                {
                    _id: id,
                    deleted: false,
                },
                req.body
            );
            res.json({ code: 200, msg: "Chỉnh sửa thành công!" });
        } else {
            res.json({ code: 500, msg: "" });
        }
    }
};
// [PATCH] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        const accountId = req.params.id;
        const currdate = new Date();
        if (accountId) {
            await Account.updateOne(
                { _id: accountId },
                { deleted: true, timeDelete: currdate }
            );
            res.json({ code: 200, msg: "Đã chuyển tài khoản vào thùng rác!" });
        } else {
            res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
        }
    }
};
