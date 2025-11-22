import { updateMatchService } from "../../services/match/update-match.service.js";
import asyncHandler from "express-async-handler";

export const updateMatchController = asyncHandler(async (req, res) => {
  const matchId = req.params.matchId;
  const userId = req.user.userId;

  const updateData = {
    title: req.body.title,
    description: req.body.description,
    teamA: req.body.teamA,
    teamB: req.body.teamB,
    matchDate: req.body.matchDate,
    teamALogo: req.body.teamALogo,
    teamBLogo: req.body.teamBLogo,
    matchResult: req.body.matchResult,
  };

  const result = await updateMatchService(matchId, userId, updateData);

  res.status(200).json(result);
});
