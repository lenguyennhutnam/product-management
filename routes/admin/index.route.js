const dashboardRoute = require("./dashboard.route");
const productsRoute = require("./products.route");
const trashbinRoute = require("./trashbin.route");
const productCategoriesRoute = require("./product-categories.route");
const systemConfig = require("../../config/system");

module.exports.index = (app) => {
    const path = systemConfig.prefixAdmin;
    app.use(`/admin`, productsRoute);
    app.use(`/${path}/dashboard`, dashboardRoute);
    app.use(`/${path}/products`, productsRoute);
    app.use(`/${path}/trashbin`, trashbinRoute);
    app.use(`/${path}/product-categories`, productCategoriesRoute);
};
