// [GET] /chat
module.exports.index = async (req, res) => {
    res.render("client/pages/chat", {
        pageTitle: "Chat",
    });
};
