import { Match } from "../../models/match.model.js";
import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";

export const deleteMatchService = async (matchId, userId) => {
  try {
    const match = await Match.findById(matchId);

    if (!match) throw new AppError(404, "Match not found");

    if (match.userId.toString() !== userId.toString())
      throw new AppError(403, "Not Authorized to delete the match");

    await Tag.deleteMany({ matchId });
    await Match.findByIdAndDelete({ _id: matchId });

    return {
      success: true,
      message: "Match & its tags deleted successfully",
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in deleting match");
  }
};
