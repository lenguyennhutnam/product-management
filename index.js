require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const routerClient = require("./routes/client/index.route");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('public'))

routerClient.index(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
