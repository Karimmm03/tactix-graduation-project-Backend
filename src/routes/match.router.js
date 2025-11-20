import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { creatMatchController } from "../controllers/match/create-match.controller.js";
import { getMatchController } from "../controllers/match/get-match.controller.js";
import { getMatchesController } from "../controllers/match/get-matches.controller.js";
import { updateMatchController } from "../controllers/match/update-match.controller.js";
import { deleteMatchController } from "../controllers/match/delete-match.controller.js";

const matchRouter = express.Router();

matchRouter.use(authMiddleware);

matchRouter.post("/", creatMatchController);
matchRouter.get("/", getMatchesController);
matchRouter.get("/:matchId", getMatchController);
matchRouter.put("/:matchId", updateMatchController);
matchRouter.delete("/:matchId", deleteMatchController);

export default matchRouter;
