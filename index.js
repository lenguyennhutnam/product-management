const express = require("express");
const app = express();
const port = 3000;
const routerClient = require("./routes/client/index.route");

app.set("views", "./views");
app.set("view engine", "pug");

routerClient.index(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
