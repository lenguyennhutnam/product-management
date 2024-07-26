const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const {
    requireAuth,
} = require("../../middlewares/admin/requireAuth.middleware.js");

module.exports.index = (app) => {
    app.use("/", productRoute);
    // app.use("/", homeRoute);
    app.use("/products", productRoute);
};
