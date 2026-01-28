import asyncHandler from "express-async-handler";
import { GetUserPanelsService } from "../../services/panel/get-user-panels.service.js";
export const GetUserPanelsController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await GetUserPanelsService(userId);

  res.status(200).json(result);
});
