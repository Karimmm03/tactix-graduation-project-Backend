import { Panel } from "../../models/panel.model.js";
import { AppError } from "../../utils/app.error.js";

export const UpdatePanelService = async (userId, panelId, updateData) => {
  if (!userId || !panelId) {
    throw new AppError(400, "User ID and Panel ID are required");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new AppError(400, "No data provided for update");
  }

  const panel = await Panel.findOne({ _id: panelId, userId });

  if (!panel) {
    throw new AppError(404, "Panel not found or access denied");
  }

  // Build update object with only provided fields
  const updates = {};
  if (updateData.title !== undefined) updates.title = updateData.title;
  if (updateData.tags !== undefined) updates.tags = updateData.tags;

  const updatedPanel = await Panel.findByIdAndUpdate(
    panelId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return {
    success: true,
    message: "Panel updated successfully",
    data: updatedPanel,
  };
};