const homeRoute = require("./home.route");
const procductRoute = require("./product.route");

module.exports.index = (app) => {
    app.use("/", homeRoute);
    app.use("/products", procductRoute);
};
