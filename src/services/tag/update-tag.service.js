import { Tag } from "../../models/tags.model.js";
import { AppError } from "../../utils/app.error.js";
import { Match } from "../../models/match.model.js";
import { redis } from "../../config/redis.config.js";
export const updateTagService = async (tagId, userId, updateData) => {
  try {
    const tag = await Tag.findById(tagId).populate("matchId");
    if (!tag) throw new AppError(404, "tag not found");

    if (tag.matchId.userId.toString() !== userId.toString())
      throw new AppError(403, "you are not authorized");

    if (updateData.startTime)
      updateData.startTime = parseInt(updateData.startTime);

    if (updateData.endTime) updateData.endTime = parseInt(updateData.endTime);

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: tagId },
      { $set: updateData },
      { new: true }
    );

    // invalidate cached match
    await redis.del(`match:${tag.matchId._id}`);

    return {
      success: true,
      message: "Tag updated successfully",
      data: updatedTag,
    };
  } catch (err) {
    console.log(err);
    throw new AppError(500, err.message || "error in updating Tag");
  }
};
