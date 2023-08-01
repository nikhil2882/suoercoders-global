const mongoose = require("mongoose");

module.exports.init = async function () {
  await mongoose.connect(
    "mongodb+srv://app:91wtwsYmEumkm6oN@cluster0.g37qn4t.mongodb.net/superCodersGlobal?retryWrites=true&w=majority"
  );
};
