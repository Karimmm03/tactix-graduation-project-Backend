import { getMatchesService } from "../../services/match/get-matches.service.js";
import asyncHandler from "express-async-handler";

export const getMatchesController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const result = await getMatchesService(userId, page, limit);

  res.status(200).json(result);
});
