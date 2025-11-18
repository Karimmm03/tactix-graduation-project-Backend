import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";
import { z } from "zod";

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
  matchDate: z
    .string({ required_error: "Match date is required" })
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
});

export const creatMatchService = async (
  userId,
  title,
  description,
  teamA,
  teamB,
  matchDate
) => {
  try {
    const parsedResult = matchSchema.safeParse({
      userId,
      title,
      description,
      teamA,
      teamB,
      matchDate,
    });

    if (!parsedResult.success) {
      const errorMessages = parsedResult.error.issues
        .map((e) => e.message)
        .join(", ");
      throw new AppError(400, `Invalid input: ${errorMessages}`);
    }

    const matchDateObj = new Date(matchDate);
    const match = await Match.create({
      userId,
      title,
      description,
      teamA,
      teamB,
      matchDateObj,
    });

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
