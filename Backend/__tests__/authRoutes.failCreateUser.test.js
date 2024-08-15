import request from "supertest";
import app from "../src/app.js";
import * as userService from "../src/services/userService.js";

// Mock global du module userService
jest.mock("../src/services/userService");

describe("POST /register with createUser mocked to fail", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks après chaque test
  });

  it("should return 500 when createUser fails", async () => {
    // Configure le mock pour createUser afin de simuler une erreur
    userService.createUser.mockImplementation(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "@Test123456",
      displayName: "Test User",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error registering user");
    expect(userService.createUser).toHaveBeenCalledTimes(1);
  });
});
