import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

var socket = io();

// CLIENT SEND MSG
const form = document.querySelector("form.inner-form");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.content.value;
        socket.emit("CLIENT_SEND_MSG", {
            content: content,
        });
        e.target.content.value = "";
    });
}
// End CLIENT SEND MSG

// SERVER RETURN MSG
socket.on("SERVER_RETURN_MSG", (data) => {
    const { userId, fullName, content } = data;
    const chatBox = document.querySelector(".inner-body");
    const id = document.querySelector(".chat").getAttribute("user-id");
    const div = document.createElement("div");
    if (userId == id) {
        div.classList.add("inner-outgoing");
        div.innerHTML = `
            <div class="inner-content">${content}</div>
        `;
    } else {
        div.classList.add("inner-coming");
        div.innerHTML = `
            <div class="inner-name">${fullName}</div>
            <div class="inner-content">${content}</div>
        `;
    }
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});
// End SERVER RETURN MSG

// Scroll to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End scroll to bottom

// Show Icon Chat
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(
        ".chat .inner-form input[name='content']"
    );

    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
    });
}
// End Show Icon Chat

// Show Popup Icon
const buttonIcon = document.querySelector("[button-icon]");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown");
    });
}
// End Show Popup Icon
