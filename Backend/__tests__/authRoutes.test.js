import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/config/prismaClient.js";
import nodemailer from "nodemailer";
import redisClient from "../src/config/redisClient.js";

describe("POST /register without createUser mocked", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "Password123!",
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual(
      "User registered. Please check your email to confirm your account."
    );

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
  });

  it("should return 400 if email is already in use", async () => {
    await prisma.user.create({
      data: {
        email: "existing@example.com",
        password: "Password123!",
        displayName: "Existing User",
        isVerified: false,
      },
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "existing@example.com",
      password: "Password123!",
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Email already in use");
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();

  });
});
