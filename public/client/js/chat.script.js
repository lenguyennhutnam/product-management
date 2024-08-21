import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

var socket = io();

// Typing
const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
);
var typingTimeOut;
if (inputChat) {
    inputChat.addEventListener("keyup", () => {
        socket.emit("CLIENT_SEND_TYPING", "show");

        clearTimeout(typingTimeOut);

        typingTimeOut = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 3000);
    });
}
// End Typing

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
        const existTyping = elementListTyping.querySelector(
            `[user-id="${data.userId}"]`
        );
        if (!existTyping) {
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userId);
            boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots"><span></span><span></span><span></span></div>`;
            elementListTyping.appendChild(boxTyping);
        }
    } else {
        const boxTypingDelete = elementListTyping.querySelector(
            `[user-id="${data.userId}"]`
        );
        if (boxTypingDelete) {
            elementListTyping.removeChild(boxTypingDelete);
        }
    }
});
// End SERVER_RETURN_TYPING

// CLIENT SEND MSG
const form = document.querySelector("form.inner-form");
if (form) {
    const upload = new FileUploadWithPreview.FileUploadWithPreview(
        "upload-images",
        {
            multiple: true,
            maxFileCount: 6,
        }
    );
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.content.value || "";
        const images = upload.cachedFileArray;
        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MSG", {
                content: content,
                images: images,
            });
            e.target.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
// End CLIENT SEND MSG

// SERVER RETURN MSG
socket.on("SERVER_RETURN_MSG", (data) => {
    const { userId, fullName, content } = data;
    const chatBox = document.querySelector(".inner-body");
    const id = document.querySelector(".chat").getAttribute("user-id");
    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";
    if (data.userId == id) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    }

    if (data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    }

    if (data.images.length > 0) {
        htmlImages += `
          <div class="inner-images">
        `;

        for (const image of data.images) {
            htmlImages += `
            <img src="${image}">
          `;
        }

        htmlImages += `
          </div>
        `;
    }
    div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;
    chatBox.insertBefore(div, elementListTyping);
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
