import { getMatchService } from "../../services/match/get-match.service.js";
import asyncHandler from "express-async-handler";

export const getMatchController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const matchId = req.params.matchId;

  const result = await getMatchService(matchId, userId);

  res.status(200).json(result);
});
