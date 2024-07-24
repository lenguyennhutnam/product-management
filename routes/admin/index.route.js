const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const trashbinRoute = require("./trashbin.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const { requireAuth } = require("../../helpers/requireAuth.helper");
const systemConfig = require("../../config/system");

module.exports.index = (app) => {
    const path = systemConfig.prefixAdmin;
    app.use(`/${path}`, productRoute);
    app.use(
        `/${path}/dashboard`, 
        requireAuth, 
        dashboardRoute
    );
    app.use(
        `/${path}/products`, 
        requireAuth, 
        productRoute
    );
    app.use(
        `/${path}/trashbin`, 
        requireAuth, 
        trashbinRoute
    );
    app.use(
        `/${path}/product-categories`, 
        requireAuth, 
        productCategoryRoute
    );
    app.use(
        `/${path}/roles`, 
        requireAuth, 
        roleRoute
    );
    app.use(
        `/${path}/accounts`, 
        requireAuth, 
        accountRoute
    );
    app.use(`/${path}/auth`, authRoute);
};
