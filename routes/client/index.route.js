module.exports.index = (app) => {
    app.get("/", (req, res) => {
        res.render("client/pages/home");
    });

    app.get("/products", (req, res) => {
        res.render("client/pages/products");
    });
};
