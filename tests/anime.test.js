const request = require("supertest");
const app = require("../src/app");
const Anime = require("../src/models/anime");
const User = require("../src/models/user");
const { userOneId, userOne, animeOneId, animeOne, setupDatabase} = require("./fixtures/db");
const defaultAnimeImg = "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png";

beforeEach(setupDatabase);

//TEST 1: Add Anime To Favourites
test("Should Add Anime To User Favourites", async () => {
    await request(app)
        .post("/users/favourites")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: "title 1",
            img_url: defaultAnimeImg,
        })
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user.favouriteAnimes.length).toBe(1);
})

//TEST 2: Get Users Anime Reviews (assert length, title, reviews, etc.)
test("Should Get Anime Reviews", async () => {
    await request(app)
        .post("/users/favourites")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: "title 1",
            img_url: defaultAnimeImg,
        })
        .expect(200)
    
        const user = await User.findById(userOneId);
        const userFavouriteAnime = user.favouriteAnimes[0];

        const anime = await Anime.findOne({title: userFavouriteAnime.title});
        expect(anime.title).toBe("title 1");
        expect(anime.reviewCount).toBe(1);
        expect(anime.reviewSum).toBe(10);
        expect(anime.writtenReviews).toHaveLength(3);
    })

//TEST 3: Post Review For Anime (check review count and sum change)

//TEST 4: Get Top Anime (assert length)