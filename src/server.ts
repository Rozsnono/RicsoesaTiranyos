import { config } from "dotenv";
import App from "./app";
import Ctrl from "./controllers/nside.controller";

config();
const app = new App([new Ctrl()]);

app.listen();
