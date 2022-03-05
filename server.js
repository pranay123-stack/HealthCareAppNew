const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });
require("./conn");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(require("./router/auth"));
app.use(require("./router/org"));
app.use(require("./router/package"));
app.use(require("./router/lead"));
app.use(require("./router/cart"));
app.use(require("./router/booking"));

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`server listening on port ${PORT}`);
});
