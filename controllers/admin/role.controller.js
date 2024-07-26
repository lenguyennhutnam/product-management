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
    if (res.locals.role.permissions.includes("roles_create")) {
        if (!req.body.title) {
            res.json({ code: 500, msg: "Tiêu đề không được để trống!" });
            return;
        }
        try {
            const newRole = new Role(req.body);
            await newRole.save();
            res.json({ code: 200, msg: "Tạo mới nhóm quyền thành công!" });
        } catch {
            res.json({ code: 500, msg: "Đã có lỗi xảy ra!" });
        }
    }
};
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const role = await Role.findOne({ _id: id });
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            roleEdit: role,
        });
    } catch {
        res.redirect("back");
    }
};
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("roles_edit")) {
        if (!req.body.title) {
            res.json({ code: 500, msg: "Tiêu đề không được để trống!" });
            return;
        }
        const id = req.params.id;
        try {
            await Role.updateOne({ _id: id, deleted: false }, req.body);
            res.json({ code: 200, msg: "Thành công" });
        } catch {
            res.json({ code: 500, msg: "Id không tồn tại" });
        }
    }
};
// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("roles_delete")) {
        const id = req.params.id;
        try {
            await Role.deleteOne({ _id: id });
            res.json({ code: 200, msg: "Xóa thành công" });
        } catch {
            res.json({ code: 500, msg: "Id không tồn tại" });
        }
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
// [PATCH] /admin/roles/permissions
module.exports.permissionPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("permissions_edit")) {
        const dataList = req.body.dataList;
        const bulkUpdate = dataList.map((data) => ({
            updateOne: {
                filter: { _id: data.id },
                update: { permissions: data.permissions },
            },
        }));
        try {
            await Role.bulkWrite(bulkUpdate);
            res.json({ code: 200, message: "Cập nhật thành công!" });
        } catch {
            res.json({ code: 500, message: "Đã xảy ra lỗi!" });
        }
    }
};
