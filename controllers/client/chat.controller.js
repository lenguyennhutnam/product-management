const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    // SocketIO
    _io.once("connection", (socket) => {
        console.log(`User ${socket.id} connected`);
        socket.on("CLIENT_SEND_MSG", async (data) => {
            const chatData = {
                userId: userId,
                content: data.content,
            };
            const chat = new Chat(chatData);

            const user = await User.findOne({ _id: userId });
            const fullName = user.fullName;

            await chat.save();
            _io.emit("SERVER_RETURN_MSG", {
                userId: userId,
                fullName: fullName,
                content: data.content,
            });
        });
    });
    // End socketIO

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
