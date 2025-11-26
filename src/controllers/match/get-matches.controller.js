import { getMatchesService } from "../../services/match/get-matches.service.js";
import asyncHandler from "express-async-handler";

export const getMatchesController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  console.log("page", page);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  console.log("limit", limit);

  const result = await getMatchesService(userId, page, limit);

  res.status(200).json(result);
});
