import asyncHandler from "express-async-handler";
import { creatMatchService } from "../../services/match/create-match.service.js";
export const creatMatchController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const title = req.body.title;
  const description = req.body.description;
  const teamA = req.body.teamA;
  const teamB = req.body.teamB;
  const matchDate = req.body.matchDate;
  const result = await creatMatchService(
    userId,
    title,
    description,
    teamA,
    teamB,
    matchDate
  );

  res.status(201).json(result);
});
