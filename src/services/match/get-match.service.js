import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";

export const getMatchService = async (matchId, userId) => {
  try {
    const match = await Match.findOne({ _id: matchId, userId }).populate(
      "tags"
    );
    if (!match) throw new AppError(404, "Match not found");

    return {
      success: true,
      data: match,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in retriving a match");
  }
};
