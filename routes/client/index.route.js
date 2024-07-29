const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const { category } = require("../../middlewares/client/category.middleware");
const { cart } = require("../../middlewares/client/cart.middleware");

module.exports.index = (app) => {
    app.use(category, cart);
    app.use("/", homeRoute);
    app.use("/cart", cartRoute);
    app.use("/products", productRoute);
    app.use("/search", searchRoute);
    app.use("/checkout", checkoutRoute);
};
