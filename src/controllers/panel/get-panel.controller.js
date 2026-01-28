import { GetPanelService } from "../../services/panel/get-panel.service.js";
import asyncHandler from "express-async-handler";

export const GetPanelController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const panelId = req.params.panelId;

  const result = await GetPanelService(userId, panelId);

  res.status(200).json(result);
});
