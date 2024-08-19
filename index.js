const express = require("express");
const app = express();
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");

// Socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End socket.io

require("dotenv").config();
const systemConfig = require("./config/system");
const port = process.env.PORT;
const routerClient = require("./routes/client/index.route");
const routerAdmin = require("./routes/admin/index.route");

const database = require("./config/database");
database.connect();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=PATCH
app.use(methodOverride("_method"));
// parse application/json
app.use(express.json());

// Flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 2000 } }));
app.use(flash());
// End flash
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

routerAdmin.index(app);
routerClient.index(app);

app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
