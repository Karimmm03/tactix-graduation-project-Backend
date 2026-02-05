import { DeletePanelService } from "../../services/panel/delete-panel.service.js";
import asyncHandler from "express-async-handler";

export const DeletePanelController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const panelId = req.params.panelId;

  const result = await DeletePanelService(userId, panelId);

  res.status(200).json(result);
});