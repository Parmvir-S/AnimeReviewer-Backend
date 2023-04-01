const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, userTwo, userTwoId, animeOne, animeTwo, animeThree, setupDatabase} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should Signup New User", async () => {
    const response = await request(app).post("/users").send({
        name: "Parm",
        email: "parm@example.com",
        password: "parmparmparm12345#"
    })

    // Assert that the db was changed correctly
    // new user with same id as the id we are getting back as response body
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Parm",
            email: "parm@example.com",
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("parmparmparm12345#");
})