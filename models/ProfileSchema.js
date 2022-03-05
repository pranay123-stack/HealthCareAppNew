const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },

  Gender: {
    type: String,
    required: true,
  },

  EmailID: {
    type: String,
    required: true,
  },

  MobileNo: {
    type: String,
    required: true,
  },

  IAm: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
