import { deleteMatchService } from "../../services/match/delete-match.service.js";
import asyncHandler from "express-async-handler";

export const deleteMatchController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const matchId = req.params.matchId;

  const result = await deleteMatchService(matchId, userId);

  res.status(200).json(result);
});
