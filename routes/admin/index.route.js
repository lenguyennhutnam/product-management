const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const trashbinRoute = require("./trashbin.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const systemConfig = require("../../config/system");

module.exports.index = (app) => {
    const path = systemConfig.prefixAdmin;
    // app.use(`/admin`, productRoute);
    app.use(`/${path}/dashboard`, dashboardRoute);
    app.use(`/${path}/products`, productRoute);
    app.use(`/${path}/trashbin`, trashbinRoute);
    app.use(`/${path}/product-categories`, productCategoryRoute);
    app.use(`/${path}/roles`, roleRoute);
    app.use(`/${path}/accounts`, accountRoute);
    app.use(`/${path}/auth`, authRoute);
};
