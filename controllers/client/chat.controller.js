const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const streamUpload = require("../../helpers/streamUpload.helper");


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
            // Upload img
            const linkImages = [];

            for (const image of data.images) {
                const result = await streamUpload(image);
                linkImages.push(result.url);
            }

            chatData.images = linkImages;
            // End upload img

            const chat = new Chat(chatData);

            const user = await User.findOne({ _id: userId });
            const fullName = user.fullName;

            await chat.save();
            _io.emit("SERVER_RETURN_MSG", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: linkImages,
            });

            // CLIENT_SEND_TYPING
            socket.on("CLIENT_SEND_TYPING", (type) => {
                socket.broadcast.emit("SERVER_RETURN_TYPING", {
                    userId: userId,
                    fullName: fullName,
                    type: type,
                });
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
