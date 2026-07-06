jest.mock("uuid", () => ({
    v4: jest.fn(() => "123e4567-e89b-12d3-a456-426614174000"),
    v5: jest.fn(() => "123e4567-e89b-12d3-a456-426614174001"),
    v1: jest.fn(() => "123e4567-e89b-12d3-a456-426614174002"),
    v3: jest.fn(() => "123e4567-e89b-12d3-a456-426614174003"),
    NIL: "00000000-0000-0000-0000-000000000000",
    validate: jest.fn(() => true),
    version: jest.fn(() => 4),
}));

import request from "supertest";
import app from "../../src/server";
import { TestHelpers } from "../helpers/testDb";
import bcrypt from "bcryptjs";

describe("Auth API Tests", () => {
    const baseUrl = "/api/auth";

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                fullName: "New User",
                email: "newuser@test.com",
                password: "Test123456",
                phone: "0123456789",
            };

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.statusCode).toBe(201);
            expect(response.body.data.user).toHaveProperty("id");
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.tokens).toHaveProperty("accessToken");
        });

        it("should return error when email already exists", async () => {
            await TestHelpers.createTestUser({ email: "duplicate@test.com" });

            const userData = {
                fullName: "Duplicate User",
                email: "duplicate@test.com",
                password: "Test123456",
            };

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("already exists");
        });
    });

    describe("POST /api/auth/login", () => {
        const loginData = {
            email: "login@test.com",
            password: "Test123456",
        };

        beforeEach(async () => {
            await TestHelpers.createTestUser({
                email: loginData.email,
                password: await bcrypt.hash(loginData.password, 12),
            });
        });

        it("should login successfully", async () => {
            const response = await request(app)
                .post(`${baseUrl}/login`)
                .send(loginData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.tokens).toHaveProperty("accessToken");
        });
    });
});
