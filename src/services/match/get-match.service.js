import { redis } from "../../config/redis.config.js";
import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";

export const getMatchService = async (matchId, userId) => {
  try {
    const cacheKey = `match:${matchId}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached,
        source: "cache",
      };
    }

    const match = await Match.findOne({ _id: matchId, userId })
      .populate("tags")
      .lean();

    if (!match) throw new AppError(404, "Match not found");

    const response = { match };

    await redis.set(cacheKey, JSON.stringify(response), { ex: 10 });

    return {
      success: true,
      data: response,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in retriving a match");
  }
};
