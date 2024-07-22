const Role = require("../../models/role.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/roles", {
        pageTitle: "Nhóm quyền",
        records: records,
    });
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Nhóm quyền",
    });
};
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Tiêu đề không được để trống!");
        res.redirect("back");
        return;
    }
    const newRole = new Role(req.body);
    await newRole.save();
    req.flash("success", "Thành công");
    res.redirect("back");
};
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await Role.findOne({ _id: id });
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            role: role,
        });
    } catch {
        req.flash("error", "Id không tồn tại");
    }
};
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if (!req.body.title) {
        req.flash("error", "Tiêu đề không được để trống!");
        res.redirect("back");
        return;
    }
    const id = req.params.id;
    try {
        await Role.updateOne({ _id: id, deleted: false }, req.body);
        req.flash("success", "Thành công");
        res.redirect("back");
    } catch {
        req.flash("error", "Id không tồn tại");
    }
};

// ====================PERMISSION============================
// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        roles: roles,
    });
};
