import "dotenv/config";
import App from "../../app";
import AuthenticationController from "../../authentication/authentication.controller";
// import PostController from "../../post/post.controller";
// import ReportController from "../../report/report.controller";
// import UserController from "../../user/user.controller";
import validateEnv from "../../utils/validateEnv";
import * as request from "supertest";

validateEnv();

let server: Express.Application;

beforeAll(async () => {
    // server = new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController()]).getServer();
    server = new App([new AuthenticationController()]).getServer();
});

describe("test API endpoints", () => {
    it("GET /auth/register", async () => {
        const response = await request(server).post("/auth/register").send({
            name: "admin",
            email: "admin@admin.com",
            password: "admin",
        });
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toEqual("User with email admin@admin.com already exists");
        expect(response.body.status).toEqual(400);
    });

    it("GET /auth/login", async () => {
        const response = await request(server).post("/auth/login").send({
            email: "user@user.com",
            password: "user",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body._id).toEqual("61d400d73aea8d9b36f5f4cc");
        expect(response.body.email).toEqual("user@user.com");
        expect(response.body.name).toEqual("user");
    });

    it("GET /auth/logout", async () => {
        const response = await request(server).post("/auth/logout");
        expect(response.text).toEqual("OK");
        expect(response.statusCode).toEqual(200);
    });
});
