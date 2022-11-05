import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import File from "../models/File";
import { IFile } from "../types/File";
import sendError from "../utils/sendError";
import sendSuccess from "../utils/sendSuccess";

export const uploadFile = async (
  req: Request | any,
  res: Response<IFile>,
  next: NextFunction
) => {
  const { file } = req;

  if (!file) return sendError(res, "No file was uploaded");

  try {
    await cloudinary.uploader
      .upload(file.path, {
        folder: "files",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      })
      .then(async (result) => {
        const { originalname, size } = file;
        const { width, height, format, resource_type, url, secure_url } =
          result;

        const newFile: IFile = new File({
          originalname,
          size,
          width,
          height,
          format,
          resource_type,
          url,
          secure_url,
        });
        await newFile.save();

        return sendSuccess(
          res,
          "File uploaded successfully",
          {
            id: newFile._id,
            linkDownload: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${newFile._id}`,
          },
          201
        );
      });
  } catch (error) {
    next(error);
  }
};
