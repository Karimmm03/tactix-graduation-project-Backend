import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    teamA: {
      type: String,
      required: true,
    },
    teamALogo: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
    teamB: {
      type: String,
      required: true,
    },
    teamBLogo: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
    matchDate: {
      type: Date,
    },
    matchResult: {
      type: String,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
