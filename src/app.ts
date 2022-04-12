import * as express from "express";
import * as mongoose from "mongoose";
import loggerMiddleware from "./middleware/logger.middleware";
import IController from "./interfaces/controller.interface";
import onesideModel from "./controllers/oneside.model";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.app.use(express.json());
        this.app.use(loggerMiddleware);
        this.initializeControllers(controllers);

        this.app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        
            next();
        });

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
