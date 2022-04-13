import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import nsideModel from "./nside.model";
import onesideModel from "./oneside.model";
import linkModel from "./link.model";
import machineModel from "./machine.model";

export default class nsideController implements Controller {
    public path = "/api/xyz";
    public router = Router();
    private nsideM = nsideModel;
    private onesideM = onesideModel;
    private linkM = linkModel;
    private machineM = machineModel;

    constructor() {
        this.router.get("/", (req: Request, res: Response) => {
            res.send("MEGY!");
        });
        this.router.get("/api/dates", this.getAll);
        this.router.get("/api/links", this.getAllLink);
		this.router.get("/api/links/:id", this.getLinkById);
        this.router.get("/api/machines", this.getAllMachine);
        this.router.get("/api/dates/:id", this.getById);
		this.router.get("/api/games", this.getAllGames);
        this.router.get("/api/games/:id", this.getByIdGame);

        this.router.post("/api/date", this.create);
        this.router.post("/api/game", this.createGame);
        this.router.post("/api/link", this.createLink);
        this.router.post("/api/machine", this.createMachine);

        this.router.put("/api/date/:id", this.modifyPUTdate);
		this.router.put("/api/game/:id", this.modifyPUTgame);
        this.router.put("/api/link/:id", this.modifyPUTlink);
        this.router.put("/api/machine/:id", this.modifyPUTmachine);

        this.router.delete("/api/dates/:id", this.delete);
    }

    private getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.nsideM.find().populate("game", "-_id");
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
	private getAllGames = async (req: Request, res: Response) => {
        try {
            const data = await this.onesideM.find();
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
    private getAllLink = async (req: Request, res: Response) => {
        try {
            const data = await this.linkM.find();
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
	private getLinkById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.linkM.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
    private getAllMachine = async (req: Request, res: Response) => {
        try {
            const data = await this.machineM.find();
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.nsideM.findById(id).populate("game", "-_id");
            if (document) {
                res.send(document);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private getByIdGame = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.onesideM.findById(id);
            if (document) {
                res.send(document);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private create = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.nsideM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private createGame = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.onesideM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private createLink = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.linkM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private createMachine = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.machineM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private modifyPATCH = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const updatedDoc = await this.nsideM.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("FK_neve", "-_id");
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private modifyPUTdate = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.nsideM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.nsideM.findById(id).populate("game", "-_id");
                res.send(updatedDoc);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
	
	private modifyPUTgame = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.onesideM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.onesideM.findById(id);
                res.send(updatedDoc);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
    private modifyPUTlink = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.linkM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.linkM.findById(id);
                res.send(updatedDoc);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
    private modifyPUTmachine = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const modificationResult = await this.machineM.replaceOne({ _id: id }, body, { runValidators: true });
            if (modificationResult.modifiedCount) {
                const updatedDoc = await this.machineM.findById(id).populate;
                res.send(updatedDoc);
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.nsideM.findByIdAndDelete(id);
            if (successResponse) {
                res.status(200).send('OK');
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };
}
