import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTagController } from "../controllers/tag/create-tag.controller.js";

const TagRouter = express.Router();

TagRouter.use(authMiddleware);

TagRouter.post("/:matchId", createTagController);

export default TagRouter;
