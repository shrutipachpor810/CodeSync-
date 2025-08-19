import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, index: true, unique: true },
  files: {
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" }
  }
}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
// This file defines the Room model for MongoDB using Mongoose.
// It includes fields for roomId and files (html, css, js) with default values  for the files.
// The roomId is indexed and unique to ensure each room can be identified distinctly.