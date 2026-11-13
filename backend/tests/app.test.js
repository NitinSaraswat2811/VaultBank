
const request = require("supertest");
const app = require("../src/app");

// Mock database models so tests don't need MongoDB.
jest.mock("../src/models/user.models", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock("../src/models/blackList.model", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

const userModel = require("../src/models/user.models");
const tokenBlacklistModel = require("../src/models/blackList.model");

process.env.JWT_SECRET = "test-secret-key";

describe("VaultBank Authentication APIs", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 1. REGISTER API
    describe("POST /api/auth/register", () => {

        test("Should register a new user successfully", async () => {
            userModel.findOne.mockResolvedValue(null);

            userModel.create.mockResolvedValue({
                _id: "user123",
                email: "test@example.com",
                firstname: "Test",
                lastname: "User",
            });

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    firstname: "Test",
                    lastname: "User",
                    email: "test@example.com",
                    password: "Test@123",
                });

            expect(response.status).toBe(201);

            expect(response.body.user.email).toBe("test@example.com");
            expect(response.body.user.firstname).toBe("Test");
            expect(response.body).toHaveProperty("token");

            expect(userModel.create).toHaveBeenCalledTimes(1);
        });

        test("Should reject registration if email already exists", async () => {
            userModel.findOne.mockResolvedValue({
                email: "test@example.com",
            });

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    firstname: "Test",
                    lastname: "User",
                    email: "test@example.com",
                    password: "Test@123",
                });

            expect(response.status).toBe(422);

            expect(response.body.message).toBe(
                "User already exists with email"
            );

            expect(userModel.create).not.toHaveBeenCalled();
        });
    });


    // 2. LOGIN API
    describe("POST /api/auth/login", () => {

        test("Should login successfully with correct credentials", async () => {
            const mockUser = {
                _id: "user123",
                email: "test@example.com",
                firstname: "Test",
                comparePassword: jest.fn().mockResolvedValue(true),
            };

            userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "Test@123",
                });

            expect(response.status).toBe(200);

            expect(response.body.user.email).toBe("test@example.com");
            expect(response.body).toHaveProperty("token");

            expect(mockUser.comparePassword).toHaveBeenCalledWith(
                "Test@123"
            );
        });

        test("Should reject login if user does not exist", async () => {
            userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "unknown@example.com",
                    password: "Test@123",
                });

            expect(response.status).toBe(401);

            expect(response.body.message).toBe(
                "Email or password is incorrect"
            );
        });

        test("Should reject login if password is incorrect", async () => {
            const mockUser = {
                comparePassword: jest.fn().mockResolvedValue(false),
            };

            userModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "WrongPassword",
                });

            expect(response.status).toBe(401);
        });
    });


    // 3. LOGOUT API
    describe("POST /api/auth/logout", () => {

        test("Should logout successfully and blacklist token", async () => {
            const response = await request(app)
                .post("/api/auth/logout")
                .set("Cookie", "token=test-token");

            expect(response.status).toBe(200);

            expect(response.body.message).toBe(
                "User logged out successfully"
            );

            expect(tokenBlacklistModel.create).toHaveBeenCalledWith({
                token: "test-token",
            });
        });

        test("Should logout successfully even if token is missing", async () => {
            const response = await request(app)
                .post("/api/auth/logout");

            expect(response.status).toBe(200);

            expect(tokenBlacklistModel.create).not.toHaveBeenCalled();
        });
    });

});
