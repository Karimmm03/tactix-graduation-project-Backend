import { GetUserPanelsController } from "../controllers/panel/get-user-panels.controller.js";
import { CreatPanelController } from "../controllers/panel/creat-panel.controller.js";
import { GetPanelController } from "../controllers/panel/get-panel.controller.js";

import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const panelRouter = express.Router();

panelRouter.use(authMiddleware);

panelRouter.post("/", CreatPanelController);
panelRouter.get("/", GetUserPanelsController);
panelRouter.get("/:panelId", GetPanelController);

export default panelRouter;
