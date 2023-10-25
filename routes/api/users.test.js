const mongoose = require('mongoose');
const app = require('../../app');
const request = require('supertest');
const { User } = require('../../models/User');


const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test login route", () => {
    let server = null;
    beforeAll(async () => {
        await mongoose.connect(TEST_DB_HOST);
        server = app.listen(3000);
    })

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    })
        afterEach(async () => {
        await User.deleteMany({});
    })

    test("test register with correct data", async () => {
        const registerData = {
            email: "example@mail.com",
            password: "password"
        }
        const { statusCode, body } = await request(app).post("/api/users/register").send(registerData);
      
        
        expect(statusCode).toBe(201);
        expect(body.email).toBe(registerData.email);
        expect(body.subscription).toBe("starter");

        const user = await User.findOne({ email: registerData.email });
        expect(user.email).toBe(registerData.email)
    })
})