const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const DB = process.env.DATABASE;

mongoose.connect(DB);
mongoose.connection.on("connected", () => {
  console.log("connected");
});
mongoose.connection.on("error", (err) => {
  console.log("error coonecting", err);
});
