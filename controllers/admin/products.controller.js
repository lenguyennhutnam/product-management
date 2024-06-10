const Products = require("../../models/product.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Products.find({});

    console.log(products);

    res.render("admin/pages/products", { pageTitle: "Products" , products: products });
};
