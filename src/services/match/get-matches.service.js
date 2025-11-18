import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";

export const getMatchesService = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    // pagination
    const matches = await Match.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("tags");

    return {
      success: true,
      data: {
        matches,
      },
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in retriving user's matches");
  }
};
