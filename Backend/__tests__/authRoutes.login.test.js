import request from "supertest";
import app from "../src/app.js";
import * as userService from "../src/services/userService.js";
import * as tokenService from "../src/services/tokenService.js";

// Mock global du module userService et tokenService
jest.mock("../src/services/userService");
jest.mock("../src/services/tokenService");

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks après chaque test
  });

  it("should return 400 if email does not exist", async () => {
    userService.findUserByEmail.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Invalid email or password");
  });

  it("should return 400 if password is incorrect", async () => {
    const user = { id: 1, email: "test@test.com", isVerified: true };
    userService.findUserByEmail.mockResolvedValue(user);
    userService.verifyPassword.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "WrongPassword123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Invalid email or password");
  });

  it("should return 400 if email is not verified", async () => {
    const user = {
      id: 1,
      email: "test@test.com",
      password: "Password123!",
      isVerified: false,
    };
    userService.findUserByEmail.mockResolvedValue(user);

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Please confirm your email to login");
  });

  it("should return tokens and user info if login is successful", async () => {
    const user = { id: 1, email: "test@test.com", isVerified: true };
    userService.findUserByEmail.mockResolvedValue(user);
    userService.verifyPassword.mockResolvedValue(true);
    tokenService.generateAccessToken.mockReturnValue("accessToken");
    tokenService.generateRefreshToken.mockReturnValue("refreshToken");

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
    userService.findUserByEmail.mockImplementation(() => {
      throw new Error("Unexpected Error");
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123!",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Error logging in");
  });
});
