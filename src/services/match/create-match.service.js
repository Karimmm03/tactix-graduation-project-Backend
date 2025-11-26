import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";
import { z } from "zod";
import { deleteKeysByPattern } from "../../utils/redis-wild-card-deletion.js";

// Validation schema for strings only, no automatic date coercion
const matchSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }),
  title: z
    .string({ required_error: "Title is required" })
    .min(2, "Title must be at least 2 characters long"),
  description: z.string().optional(),
  teamA: z
    .string({ required_error: "Team A name is required" })
    .min(2, "Team A name must be at least 2 characters long"),
  teamB: z
    .string({ required_error: "Team B name is required" })
    .min(2, "Team B name must be at least 2 characters long"),
  matchDate: z.string({ required_error: "Match date is required" }).optional(),
  teamALogo: z.string().optional(),
  teamBLogo: z.string().optional(),
  matchResult: z.string().optional(),
});

export const creatMatchService = async (
  userId,
  title,
  description,
  teamA,
  teamB,
  matchDate,
  teamALogo,
  teamBLogo,
  matchResult
) => {
  try {
    const parsedResult = matchSchema.safeParse({
      userId,
      title,
      description,
      teamA,
      teamB,
      matchDate,
      teamALogo,
      teamBLogo,
      matchResult,
    });

    if (!parsedResult.success) {
      const errorMessages = parsedResult.error.issues
        .map((e) => e.message)
        .join(", ");
      throw new AppError(400, `Invalid input: ${errorMessages}`);
    }

    const dateObj = new Date(matchDate);
    if (isNaN(dateObj.getTime())) {
      throw new AppError(
        400,
        "Invalid matchDate format. Use YYYY-MM-DD or ISO string."
      );
    }

    const match = await Match.create({
      userId,
      title,
      description,
      teamA,
      teamB,
      matchDate: dateObj,
      teamALogo,
      teamBLogo,
      matchResult,
    });

    // Invalidate the Get Matches user because new match been added so it can cause steal data
    await deleteKeysByPattern(`matches:user:${userId}:*`);

    return {
      success: true,
      message: "Match created successfully",
      data: {
        match,
        matchId: match._id.toString(),
      },
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "Match Creation failed");
  }
};
