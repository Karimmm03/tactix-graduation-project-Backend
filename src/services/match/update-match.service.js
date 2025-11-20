import { Match } from "../../models/match.model.js";
import { AppError } from "../../utils/app.error.js";

export const updateMatchService = async (matchId, userId, updateData) => {
  try {
    const match = await Match.findById(matchId);

    if (!match) throw new AppError(404, "Match not found");

    if (match.userId.toString() !== userId.toString())
      throw new AppError(403, "Not authorized to update this match");

    if (updateData.matchDate)
      updateData.matchDate = new Date(updateData.matchDate);

    const updatedMatch = await Match.findOneAndUpdate(
      { _id: matchId },
      { $set: updateData },
      { new: true }
    );

    return {
      success: true,
      message: "Match updated successfully",
      data: updatedMatch,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "Match update failed");
  }
};
