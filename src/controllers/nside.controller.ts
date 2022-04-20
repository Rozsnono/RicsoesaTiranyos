import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import nsideModel from "./nside.model";
import onesideModel from "./oneside.model";
import linkModel from "./link.model";
import youtubeLink from "./youtubeLink.model";
import machineModel from "./machine.model";

export default class nsideController implements Controller {
    public path = "/api/xyz";
    public router = Router();
    private nsideM = nsideModel;
    private onesideM = onesideModel;
    private linkM = linkModel;
    private machineM = machineModel;
    private ylM = youtubeLink;

    constructor() {
        this.router.get("/", (req: Request, res: Response) => {
            res.send("MEGY!");
        });
        
        this.router.get("/api/dates", this.getAll);
        this.router.get("/api/futureDates",this.getFutureDates)
        this.router.get("/api/links", this.getAllLink);
		this.router.get("/api/links/:id", this.getLinkById);
        this.router.get("/api/machines", this.getAllMachine);
        this.router.get("/api/dates/:id", this.getById);
		this.router.get("/api/games", this.getAllGames);
        this.router.get("/api/games/:id", this.getByIdGame);
        this.router.get("/api/youtube", this.getAllYoutubeLink);
        this.router.get("/api/youtube/:name", this.getYoutubeLinkByName);


        this.router.post("/api/date", this.create);
        this.router.post("/api/game", this.createGame);
        this.router.post("/api/link", this.createLink);
        this.router.post("/api/machine", this.createMachine);
        this.router.post("/api/youtube", this.createYoutube);

        this.router.put("/api/date/:id", this.modifyPUTdate);
		this.router.put("/api/game/:id", this.modifyPUTgame);
        this.router.put("/api/link/:id", this.modifyPUTlink);
        this.router.put("/api/machine/:id", this.modifyPUTmachine);

        this.router.delete("/api/dates/:id", this.delete);
        this.router.delete("/api/games/:id", this.deleteGame);
        this.router.delete("/api/youtube/:id", this.deleteYoutube);
    }

    private getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.nsideM.find().populate("game", "-_id");
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private getFutureDates = async (req: Request, res: Response) => {
        try {
            const data = await this.nsideM.find().populate("game", "-_id");
            for (let index = 0; index < data.length; index++) {
                if(new Date(data[index].end) < new Date()){
                    data.splice(index,1);
                }
            }
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
    private getAllYoutubeLink = async (req: Request, res: Response) => {
        try {
            const data = await this.ylM.find();
            res.send(data);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private getYoutubeLinkByName = async (req: Request, res: Response) => {
        try {
            const name = req.params.name;
            const data = await this.ylM.find({'name': name});
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
            const data = await this.nsideM.find().populate("game", "-_id");
            const body = req.body;
            let newId = 0;
            if(data.length > 0){
                data.forEach(element => {
                    if(new Date(element.start) <= new Date(body.start) && new Date(element.end) > new Date(body.start) || new Date(element.start) < new Date(body.end) && new Date(element.end) >= new Date(body.end) ){
                        res.status(400).send("Error");
                    }
                    
                    newId = element._id > newId ? element._id : newId;
                });
            }
            


            const createdDocument = new this.nsideM({
                _id: (newId+1),
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private createYoutube = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.ylM({
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

    private deleteYoutube = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.ylM.findByIdAndDelete(id);
            if (successResponse) {
                res.status(200).send('OK');
            } else {
                res.status(404).send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    };

    private deleteGame = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.onesideM.findByIdAndDelete(id);
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
