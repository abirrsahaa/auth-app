const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

require("./config/database").connect();

// const bodyparser = require("body-parser");
// // const { Console, error } = require("console");
// app.use(express.json());
// app.use(bodyparser.json());

// let credentials = [];

// app.listen(3000, () => {
//   console.log("virat kohli!!");
// });

const user = require("./routes/user");
app.use("/api/v1", user);

app.listen(PORT, () => {
  console.log(`App is running at port no ${PORT}`);
});
