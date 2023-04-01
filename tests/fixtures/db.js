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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Tarsem",
    email: "Tarsem@example.com",
    password: "VancouverCanucks123%%",
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    ]
}

const animeOne = {
    _id: new mongoose.Types.ObjectId(),
    title: "title 1",
    image: defaultAnimeImg,
    reviewCount: 1,
    reviewSum: 10,
    writtenRevies: []
}

const animeTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: "title 2",
    image: defaultAnimeImg,
    reviewCount: 2,
    reviewSum: 20,
    writtenRevies: []
}

const animeThree = {
    _id: new mongoose.Types.ObjectId(),
    title: "title 3",
    image: defaultAnimeImg,
    reviewCount: 3,
    reviewSum: 30,
    writtenRevies: []
}

const setupDatabase = async () => {
    await User.deleteMany(); //wipes db
    await Anime.deleteMany();
    await new User(userOne).save(); //save user to db
    await new User(userTwo).save(); 
    await new Anime(animeOne).save(); //save anime to db
    await new Anime(animeTwo).save();
    await new Anime(animeThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    animeOne,
    animeTwo,
    animeThree,
    setupDatabase
}