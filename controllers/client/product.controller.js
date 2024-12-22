const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const newPrice = require("../../helpers/caculateNewPrice.helper");
const getSubCategory = require("../../helpers/getSubCategory.helper");

// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active",
  }).sort({
    position: "desc",
  });
  newPrice(products);
  res.render("client/pages/products", {
    pageTitle: "Trang san pham",
    products: products,
  });
};
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active",
    });
    const subCategoryList = await getSubCategory(category._id);
    const products = await Product.find({
      category_id: {
        $in: [category._id, ...subCategoryList],
      },
      deleted: false,
      status: "active",
    }).sort({
      position: "desc",
    });
    newPrice(products);
    res.render("client/pages/products", {
      pageTitle: category.title,
      products: products,
    });
  } catch {
    res.redirect("back");
  }
};

// [GET] /products/detail/:slug
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

