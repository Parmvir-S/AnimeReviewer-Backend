const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
}).catch((error) => {
  console.log("DB Connection Failed", error);
})
