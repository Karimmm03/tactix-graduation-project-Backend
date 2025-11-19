import { deleteTagService } from "../../services/tag/delete-tag.service.js";
import asyncHandler from "express-async-handler";

export const deleteTagController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const tagId = req.params.tagId;

  const result = await deleteTagService(tagId, userId);

  res.status(200).json(result);
});
