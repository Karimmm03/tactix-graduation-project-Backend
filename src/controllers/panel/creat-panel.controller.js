import { CreatePanelService } from "../../services/panel/create-panel.service.js";
import asyncHandler from "express-async-handler";

export const CreatPanelController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const title = req.body.title;
  const tags = req.body.tags;

  const result = await CreatePanelService(userId, title, tags);

  res.status(201).json(result);
});
