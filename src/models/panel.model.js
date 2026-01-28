import mongoose from "mongoose";

const panelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    require: true,
  },
  tags: [
    {
      type: String,
    },
  ],
});

export const Panel = mongoose.model("Panel", panelSchema);
