import App from "./app";
import Ctrl from "./controllers/nside.controller";

const app = new App([new Ctrl()]);

app.listen();
