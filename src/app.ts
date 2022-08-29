import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import loggerMiddleware from "./middleware/logger.middleware";
import IController from "./interfaces/controller.interface";
import onesideModel from "./controllers/oneside.model";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.app.use(express.json());
        this.app.use(express.bodyParse({limit: '300mb'} ));
        const allowedOrigins = ["https://6256e3e7c649312efddd8a75--ricsoesatiranyos2.netlify.app/"];
        this.app.use(function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Credentials', "true");
            next();
        });
        
        this.app.use(loggerMiddleware);
        this.initializeControllers(controllers);
    }

    

    

    public listen(): void {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            console.log(`App listening on the port `, port);
        });
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    private connectToTheDatabase() {
        mongoose.connect(`mongodb+srv://rozsnono:r2fwWbkxi4dRM2ju@ricsoesatiranyos.l6ivq.mongodb.net/RicsoesaTiranyos?retryWrites=true&w=majority`);
        onesideModel.init();
    }
}
