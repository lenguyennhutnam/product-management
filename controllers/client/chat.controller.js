const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
    // SocketIO
    chatSocket(req, res);
    // End SocketIO

    const chats = await Chat.find({});

    for (const chat of chats) {
        const info = await User.findOne({ _id: chat.userId });
        chat.fullName = info.fullName;
    }
    res.render("client/pages/chat", {
        pageTitle: "Chat",
        chats: chats,
    });
};
