const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");
const usersRoute = require("./users.route");
const redisRoute = require("./redis.route");
const { setting } = require("../../middlewares/client/setting.middleware");
const {
  userInfor,
  requireAuth,
} = require("../../middlewares/client/user.middleware");
const { category } = require("../../middlewares/client/category.middleware");
const { cart } = require("../../middlewares/client/cart.middleware");

module.exports.index = (app) => {
  app.use(category, cart, userInfor, setting);
  app.use("/", homeRoute);
  app.use("/cart", cartRoute);
  app.use("/products", productRoute);
  app.use("/redis", redisRoute);
  app.use("/search", searchRoute);
  app.use("/checkout", checkoutRoute);
  app.use("/user", userRoute);
  app.use("/chat", requireAuth, chatRoute);
  app.use("/users", requireAuth, usersRoute);
};
