import request from "supertest";
import app from "../src/app.js";
import * as userService from "../src/services/userService.js";
import * as tokenService from "../src/services/tokenService.js";
import redisClient from "../src/config/redisClient.js";

// Mock global du module userService et tokenService
jest.mock("../src/services/userService");
jest.mock("../src/services/tokenService");

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks après chaque test
  });

  afterAll(async () => {
    jest.resetAllMocks(); // Réinitialise les mocks après tous les tests
    await redisClient.quit();
  });

  it("should return 400 if email does not exist", async () => {
    userService.validateUserForLogin.mockImplementation(() => {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Invalid email or password");
  });

  it("should return 400 if password is incorrect", async () => {
    userService.validateUserForLogin.mockImplementation(() => {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "WrongPassword123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Invalid email or password");
  });

  it("should return 400 if email is not verified", async () => {
    userService.validateUserForLogin.mockImplementation(() => {
      const error = new Error("Please confirm your email to login");
      error.statusCode = 400;
      throw error;
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Please confirm your email to login");
  });

  it("should return tokens and user info if login is successful", async () => {
    const user = { id: 1, email: "test@test.com", isVerified: true };
    userService.validateUserForLogin.mockResolvedValue(user);
    tokenService.generateTokensForUser.mockReturnValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      user: user,
    });
  });

  it("should return 500 if there is an unexpected error", async () => {
    userService.validateUserForLogin.mockImplementation(() => {
      throw new Error("Unexpected Error");
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Unexpected Error");
  });
});
