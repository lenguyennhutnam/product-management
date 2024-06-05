module.exports.index = (req, res) => {
    res.render("client/pages/home", {pageTitle: "Trang chu"});
};
module.exports.create = (req, res) => {
    res.send("Home create");
};
module.exports.delete = (req, res) => {
    res.send("Home delete");
};
