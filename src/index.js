const express = require("express");
const cors = require("cors");
const User = require("./models/user");
require("./db/mongoose");
const auth = require("../src/middleware/auth");
const Anime = require("./models/anime");

const app = express();
const port = process.env.PORT;
app.use(cors());

app.use(express.json());

// Personal Notes:
// ----------------------
// save() is a method on a Mongoose document. The save() method is asynchronous, so it returns a promise that you can await on.
// When you create an instance of a Mongoose model using new, calling save() makes Mongoose insert a new document.
// Will insert a user document with the passed in parameters into the users collection

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

app.patch("/users/profile", auth, async (req, res) => {
  try {
    req.user.name = req.body.name;
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

app.post("/users/favourites", auth, async (req, res) => {
  try {
    req.user.favouriteAnimes.push(req.body);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

app.get("/users/getFavourites", auth, async (req, res) => {
  try {
    res.send(req.user.favouriteAnimes);
  } catch (e) {
    res.status(400).send();
  }
});

app.post("/users/postReview", auth, async (req, res) => {
  const anime = await Anime.findOne({ title: req.body.title });
  if (!anime) {
    try {
      const anime = new Anime(req.body);
      anime.writtenReviews.push({ review: req.body.review });
      await anime.save();
      res.send(anime);
    } catch (e) {
      res.status(400).send();
    }
  } else {
    try {
      anime.reviewCount += 1;
      anime.reviewSum = Number(anime.reviewSum) + Number(req.body.reviewSum);
      anime.writtenReviews.push({ review: req.body.review });
      await anime.save();
      res.send(anime);
    } catch (e) {
      res.status(400).send();
    }
  }
});

app.get("/users/getTopAnime", auth, async (req, res) => {
  try {
    const top = await Anime.find({}).sort({ reviewSum: -1 }).limit(12);
    res.send(top);
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
