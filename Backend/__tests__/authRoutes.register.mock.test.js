import request from "supertest";
import app from "../src/app.js";
import * as userService from "../src/services/userService.js";
import redisClient from "../src/config/redisClient.js";

// Mock global du module userService
jest.mock("../src/services/userService");

describe("POST /register with registerUserTransaction mocked to fail", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks après chaque test
  });

  afterAll(async () => {
    jest.resetAllMocks(); // Réinitialise les mocks après tous les tests
    await redisClient.quit();
  });

  it("should return 500 when registerUserTransaction fails", async () => {
    // Configure le mock pour registerUserTransaction afin de simuler une erreur
    userService.registerUserTransaction.mockImplementation(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "@Test123456",
      displayName: "Test User",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error registering user");
    expect(userService.registerUserTransaction).toHaveBeenCalledTimes(1);
  });
});
