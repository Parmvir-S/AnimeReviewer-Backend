const mongoose = require("mongoose");
const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  reviewSum: {
    type: Number,
    required: true,
  },
  writtenReviews: [
    {
      review: {
        type: String,
      },
    },
  ],
});

const Anime = mongoose.model("Anime", animeSchema);
module.exports = Anime;
