import { Match } from "../../models/match.model.js";
import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";

export const createTagService = async (
  matchId,
  startTime,
  endTime,
  event,
  notes
) => {
  try {
    const start = parseInt(startTime);
    const end = parseInt(endTime);
    const tag = await Tag.create({
      matchId,
      startTime: start,
      endTime: end,
      event,
      notes,
    });

    await Match.findByIdAndUpdate(
      matchId,
      { $push: { tags: tag._id } },
      { new: true }
    );
    return {
      success: true,
      message: "Tag Created Successfully",
      data: tag,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err || "Error in Creating Tag");
  }
};
