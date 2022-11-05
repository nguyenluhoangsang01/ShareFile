import { model, Schema } from "mongoose";
import { IFile } from "../types/File";

const fileSchema: Schema = new Schema<IFile>(
  {
    originalname: {
      type: String,
    },
    size: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    format: {
      type: String,
    },
    resource_type: {
      type: String,
    },
    url: {
      type: String,
    },
    secure_url: {
      type: String,
    },
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const File = model<IFile>("File", fileSchema);

export default File;
