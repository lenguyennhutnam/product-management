const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model.js");
const Account = require("../../models/account.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const moment = require("moment");
const convertDateTime = require("../../helpers/convertDateTime.helper.js");

// [GET] /admin/trashbin
module.exports.index = async (req, res) => {
    const category = req.query.category || "products";
    const model = {
        products: Product,
        "product-categories": ProductCategory,
        accounts: Account,
    };
    const find = {
        deleted: true,
    };

    // search products
    let keyword = "";
    if (req.query.keyword && category != "accounts") {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    // pagination
    const pagination = await paginationHelper.pagination(
        req,
        await model[category].countDocuments(find),
        10
    );

    const items = await model[category]
        .find(find)
        .lean()
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort({
            timeDelete: "desc",
        });
    for (const item of items) {
        item.timeDelete = moment(item.timeDelete).format("DD/MM/YYYY HH:mm");
        const deletor = await Account.findOne(item.deletor);
        if (deletor) {
            item.deletor = deletor.fullName;
        }
        item.id = item._id;
    }
    res.render("admin/pages/trashbin", {
        pageTitle: "Trash bin",
        category: category,
        items: items,
        keyword: keyword,
        pagination: pagination,
    });
};
// [PATCH] /admin/trashbin/recovery/:id
module.exports.recovery = async (req, res) => {
    const { category } = req.body;
    const model = {
        products: Product,
        "product-categories": ProductCategory,
        accounts: Account,
    };
    const id = req.params.id;
    try {
        await model[category].updateOne(
            { _id: id },
            { deleted: false, status: "inactive" }
        );
        res.json({ code: 200, msg: "Khôi phục thành công!" });
    } catch {
        res.json({ code: 500, msg: "Lỗi" });
    }
};
// [DELETE] /admin/trashbin/delete/:id
module.exports.delete = async (req, res) => {
    const { category } = req.body;
    const model = {
        products: Product,
        "product-categories": ProductCategory,
        accounts: Account,
    };
    const productId = req.params.id;
    try {
        await model[category].deleteOne({ _id: productId });
        res.json({
            code: 200,
            msg: "Đã xóa vĩnh viễn khỏi hệ thống!",
        });
    } catch {
        res.json({ code: 500, msg: "Lỗi!" });
    }
};

// [PATCH] /admin/trashbin/recovery-many
module.exports.recoveryMany = async (req, res) => {
    const { category } = req.body;
    const model = {
        products: Product,
        "product-categories": ProductCategory,
        accounts: Account,
    };
    const { itemIds } = req.body;
    try {
        await model[category].updateMany({ _id: itemIds }, { deleted: false });
        res.json({
            code: 200,
            msg: `Khôi phục thành công!`,
        });
    } catch {
        res.json({
            code: 500,
            msg: "Lỗi",
        });
    }
};
// [DELETE] /admin/trashbin/delete-many
module.exports.deleteMany = async (req, res) => {
    const { category } = req.body;
    const model = {
        products: Product,
        "product-categories": ProductCategory,
        accounts: Account,
    };
    const { itemIds } = req.body;
    try {
        await model[category].deleteMany({ _id: itemIds });
        res.json({
            code: 200,
            msg: `Đã được vĩnh viễn khỏi hệ thống!`,
        });
    } catch {
        res.json({
            code: 500,
            msg: "Lỗi",
        });
    }
};
