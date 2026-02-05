import { UpdatePanelService } from "../../services/panel/update-panel.service.js";
import asyncHandler from "express-async-handler";

export const UpdatePanelController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const panelId = req.params.panelId;

  const updateData = {
    title: req.body.title,
    tags: req.body.tags,
  };

  const result = await UpdatePanelService(userId, panelId, updateData);

  res.status(200).json(result);
});