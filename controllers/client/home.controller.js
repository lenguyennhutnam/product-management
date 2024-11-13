const Product = require("../../models/product.model");
const newPrice = require("../../helpers/caculateNewPrice.helper");

// [GET] /
module.exports.index = async (req, res) => {
  const products = await Product.find({
    featured: 1,
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(3)
    .select("-description");
  const newProduct = await Product.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(6)
    .select("-description");
  newPrice(products);
  newPrice(newProduct);
  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    products: products,
    newProduct: newProduct,
  });
};
