import { updateTagService } from "../../services/tag/update-tag.service.js";
import asyncHandler from "express-async-handler";

export const updateTagController = asyncHandler(async (req, res) => {
  const tagId = req.params.tagId;
  const userId = req.user.userId;

  const updateData = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    event: req.body.event,
    notes: req.body.notes,
  };

  const result = await updateTagService(tagId, userId, updateData);

  res.status(200).json(result);
});
