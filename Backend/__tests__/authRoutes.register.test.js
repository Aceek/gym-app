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

  it("should return 400 with a specific error message if email is invalid", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "invalid-email",
      password: "Password123!",
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toContainEqual({
      field: "email",
      message: "Enter a valid email",
    });
  });

  it("should return 400 if the user has already registered but not confirmed their email", async () => {
    await prisma.user.create({
      data: {
        email: "pending@test.com",
        password: "Password123!",
        displayName: "Pending User",
        isVerified: false,
        emailConfirmationToken: "existingToken",
      },
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "pending@test.com",
      password: "Password123!",
      displayName: "New User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Email already in use");
  });

  it("should return 400 with a specific error message if displayName is empty", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "Password123!",
      displayName: "",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toContainEqual({
      field: "displayName",
      message: "Display name is required",
    });
  });

  it("should return 400 with a specific error message if the password is too short", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "abc", // Trop court, 3 caractères
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toContainEqual({
      field: "password",
      message: "Password must be at least 6 characters long",
    });
  });

  it("should return 400 with a specific error message if the password does not contain a number", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "abcdef", // Pas de chiffre
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toContainEqual({
      field: "password",
      message: "Password must contain a number",
    });
  });

  it("should return 400 with all specific error messages if the password does not meet multiple requirements", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "abc",
      displayName: "Test User",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual([
      {
        field: "password",
        message: "Password must be at least 6 characters long",
      },
      { field: "password", message: "Password must contain a number" },
      {
        field: "password",
        message: "Password must contain an uppercase letter",
      },
      {
        field: "password",
        message: "Password must contain a special character",
      },
    ]);
  });

  it("should create a new user in the database with the correct details", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "newuser@test.com",
      password: "Password123!",
      displayName: "New User",
    });

    const user = await prisma.user.findUnique({
      where: { email: "newuser@test.com" },
    });
    expect(user).not.toBeNull();
    expect(user.email).toEqual("newuser@test.com");
    expect(user.displayName).toEqual("New User");
    expect(user.isVerified).toBe(false);
  });

  // it("should return 429 if too many requests are made to the register endpoint", async () => {
  //   for (let i = 0; i < 10; i++) {
  //     await request(app)
  //       .post("/api/auth/register")
  //       .send({
  //         email: `test${i}@test.com`,
  //         password: "Password123!",
  //         displayName: "Test User",
  //       });
  //   }

  //   const res = await request(app).post("/api/auth/register").send({
  //     email: "testlimit@test.com",
  //     password: "Password123!",
  //     displayName: "Test User",
  //   });

  //   expect(res.statusCode).toEqual(429);
  //   expect(res.body.message).toEqual(
  //     "Too many requests, please try again later."
  //   );
  // });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.quit();
  });
});
