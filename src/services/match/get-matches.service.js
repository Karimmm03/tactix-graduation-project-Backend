import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";
import { redis } from "../../config/redis.config.js";
export const getMatchesService = async (userId, page = 1, limit = 10) => {
  try {
    const cacheKey = `matches:user:${userId}:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached,
        source: "cache",
      };
    }

    const skip = (page - 1) * limit;

    // pagination
    const matches = await Match.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("tags")
      .lean();

    const response = { matches };

    await redis.set(cacheKey, JSON.stringify(response), { ex: 30 });

    return {
      success: true,
      data: response,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "Error in retriving user's matches");
  }
};
