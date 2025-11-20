import { createTagService } from "../../services/tag/create-tag.service.js";
import asyncHandler from "express-async-handler";

export const createTagController = asyncHandler(async (req, res) => {
  const matchId = req.params.matchId;

  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const event = req.body.event;
  const notes = req.body.note;

  const result = await createTagService(
    matchId,
    startTime,
    endTime,
    event,
    notes
  );

  res.status(201).json(result);
});
