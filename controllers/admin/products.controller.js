const Products = require("../../models/product.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    // filter products
    const filterStatus = [
        { title: "Tất cả", status: "" },
        { title: "Hoạt động", status: "active" },
        { title: "Dừng hoạt động", status: "inactive" },
    ];
    if (req.query.status) {
        find.status = req.query.status;
    }
    // search products
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    const products = await Products.find(find);

    res.render("admin/pages/products", {
        pageTitle: "Products",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
    });
};
