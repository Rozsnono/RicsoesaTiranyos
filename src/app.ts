import * as express from "express";
import * as mongoose from "mongoose";
import IController from "./interfaces/controller.interface";
import loggerMiddleware from "./middleware/logger.middleware";
import onesideModel from "./controllers/oneside.model";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.app.use(express.json());
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    public listen(): void {
        this.app.listen(5000, () => {
            console.log(`App listening on the port 5000`);
        });
    }

    private connectToTheDatabase() {
        mongoose.connect(`mongodb+srv://rozsnono:r2fwWbkxi4dRM2ju@ricsoesatiranyos.l6ivq.mongodb.net/RicsoesaTiranyos?retryWrites=true&w=majority`);
        onesideModel.init();
    }
}
