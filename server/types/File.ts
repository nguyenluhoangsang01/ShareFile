import { Document } from "mongoose";

export interface IFile extends Document {
  originalname?: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  url?: string;
  secure_url?: string;
  sender?: string;
  receiver?: string;
}
