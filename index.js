const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT;
const routerClient = require("./routes/client/index.route");

const database = require("./config/database");
database.connect();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

routerClient.index(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
