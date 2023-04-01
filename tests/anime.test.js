const request = require("supertest");
const app = require("../src/app");
const Anime = require("../src/models/anime");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");
const defaultAnimeImg =
  "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png";

beforeEach(setupDatabase);

test("Should Add Anime To User Favourites", async () => {
  await request(app)
    .post("/users/favourites")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "title 1",
      img_url: defaultAnimeImg,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.favouriteAnimes.length).toBe(1);
});

test("Should Get Anime Reviews", async () => {
  await request(app)
    .post("/users/favourites")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "title 1",
      img_url: defaultAnimeImg,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  const userFavouriteAnime = user.favouriteAnimes[0];

  const anime = await Anime.findOne({ title: userFavouriteAnime.title });
  expect(anime.title).toBe("title 1");
  expect(anime.reviewCount).toBe(1);
  expect(anime.reviewSum).toBe(10);
  expect(anime.writtenReviews).toHaveLength(3);
});

test("Should Get Anime Reviews", async () => {
  const response = await request(app)
    .post("/users/postReview")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "Anime 1",
      image: defaultAnimeImg,
      reviewCount: 1,
      reviewSum: 5,
      review: "Amazing",
    })
    .expect(200);

  const animeId = response.body._id;
  const anime = await Anime.findById(animeId);

  expect(anime.title).toBe(response.body.title);
  expect(anime.reviewCount).toBe(response.body.reviewCount);
  expect(anime.reviewSum).toBe(response.body.reviewSum);
  expect(anime.writtenReviews).toHaveLength(1);
});

test("Should Get Anime Reviews", async () => {
  const response = await request(app)
    .get("/users/getTopAnime")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body).toHaveLength(1);
});
