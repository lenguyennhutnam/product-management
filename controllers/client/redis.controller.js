const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const newPrice = require("../../helpers/caculateNewPrice.helper");
const getSubCategory = require("../../helpers/getSubCategory.helper");

// Method 1: Using setTimeout with Promise
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// [GET] /redis/clear
module.exports.clear = async (req, res) => {
  const redisClient = req.app.get("redisClient");
  const result = await redisClient.flushAll();
  console.log(
    result == "OK" ? "Dữ liệu trong redis đã được xóa" : "Đã có lỗi xảy ra"
  );
  await delay(2000);
  return res.json(result);
};

// [GET] /redis/detail/:slug
module.exports.detail = async (req, res) => {
  let product = null;
  const redisClient = req.app.get("redisClient");
  const slug = req.params.slug;
  // Lấy danh sách slug sản phẩm
  const slugKey = await redisClient.get(slug);
  let dataFromRedis = false;
  if (!slugKey) {
    // Nếu chưa tồn tại, thêm slug vào redis
    product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    }).lean();
    product.newPrice = (
      (1 - product.discountPercentage / 100) *
      product.price
    ).toFixed(2);
    await redisClient.set(slug, JSON.stringify(product));
  } else {
    // Nếu tồn tại, lấy dữ liệu từ redis
    dataFromRedis = true;
    product = await redisClient.get(slugKey);
  }
  console.log(
    dataFromRedis ? "Dữ liệu được lấy từ redis" : "Dữ liệu được lấy từ database"
  );
  await delay(2000);
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
