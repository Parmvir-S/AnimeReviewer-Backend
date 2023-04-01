const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Anime = require("../../src/models/anime");

const defaultAnimeImg = "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png";
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Piara",
    email: "piara@example.com",
    password: "torontoRaptors123%%",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
}

const animeOneId = new mongoose.Types.ObjectId();
const animeOne = {
    _id: animeOneId,
    title: "title 1",
    image: defaultAnimeImg,
    reviewCount: 1,
    reviewSum: 10,
    writtenReviews: [
        {
            review: "Awesome",
        },
        {
            review: "The Best",            
        },
        {
            review: "Too Good"
        }
    ]
}

const setupDatabase = async () => {
    await User.deleteMany(); //wipes db
    await Anime.deleteMany();
    await new User(userOne).save(); //save user to db
    await new Anime(animeOne).save(); //save anime to db
}

module.exports = {
    userOneId,
    userOne,
    animeOneId,
    animeOne,
    defaultAnimeImg,
    setupDatabase
}