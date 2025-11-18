import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { creatMatchController } from "../controllers/match/create-match.controller.js";
import { getMatchController } from "../controllers/match/get-match.controller.js";
import { getMatchesController } from "../controllers/match/get-matches.controller.js";

const matchRouter = express.Router();

matchRouter.use(authMiddleware);

matchRouter.post("/", creatMatchController);
matchRouter.get("/:matchId", getMatchController);
matchRouter.get("/", getMatchesController);

export default matchRouter;
