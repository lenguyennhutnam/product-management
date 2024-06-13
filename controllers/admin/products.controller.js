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

    // pagination
    const pagination = {
        currentPage: 1,
        limit: 4,
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    const numberOfPages =
        (await Products.countDocuments(find)) / pagination.limit;
    pagination.totalPages = Math.ceil(numberOfPages);
    pagination.skip = (pagination.currentPage - 1) * pagination.limit;
    const products = await Products.find(find)
        .limit(pagination.limit)
        .skip(pagination.skip);

    res.render("admin/pages/products", {
        pageTitle: "Products",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination,
    });
};
