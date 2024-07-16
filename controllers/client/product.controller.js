const Product = require("../../models/product.model");

// [GET] /products/
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active",
    }).sort({
        position: "desc",
    });
    products.map((product) => {
        return (product.newPrice = (
            (1 - product.discountPercentage / 100) *
            product.price
        ).toFixed(0));
    });
    res.render("client/pages/products", {
        pageTitle: "Trang san pham",
        products: products,
    });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active",
    });
    if (product) {
        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product,
        });
    } else {
        res.redirect("/");
        return;
    }
};
