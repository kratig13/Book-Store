const express = require('express');
const app = express();
app.use(express.json());
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const books = require("./routes/books");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const order = require("./routes/order");


// routes
app.use("/api/v1",user);
app.use("/api/v1", books);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);
//  creating port
app.listen(process.env.PORT, ()=>{
    console.log(`SERVER STARTED AT PORT ${process.env.PORT}`);
});