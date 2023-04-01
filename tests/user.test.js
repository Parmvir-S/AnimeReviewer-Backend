const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase} = require("./fixtures/db");

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

test("Should Login Existing User", async () => {
    const response = await request(app).post("/users/login").send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(user).not.toBeNull();

    expect(user.tokens[1].token).toBe(response.body.token)
})

test("Should Not Login Non-Existent User", async () => {
    await request(app).post("/users/login").send({
        "email": "Lebron@gmail.com",
        "password": "LALakers12345^#%"
    }).expect(400)
})

test("Should Update Name Of Existing User", async () => {
    await request(app)
        .patch("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ "name" : "Pascal Siakam"})
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user.name).toBe("Pascal Siakam");
})

test("Should Not Update Invalid User Fields", async () => {
    await request(app)
        .patch("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ "Location" : "Vancouver" })
        .expect(400)
})