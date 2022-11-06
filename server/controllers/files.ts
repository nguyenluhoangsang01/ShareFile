import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import https from "https";
import nodemailer from "nodemailer";
import File from "../models/File";
import { IFile } from "../types/File";
import createEmailTemplate from "../utils/createEmailTemplate";
import sendError from "../utils/sendError";
import sendSuccess from "../utils/sendSuccess";

export const uploadFile = async (
  req: Request | any,
  res: Response<IFile>,
  next: NextFunction
) => {
  const { file } = req;

  if (!file) return sendError(res, "No file was uploaded.");

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
          "File uploaded successfully!",
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

export const getFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const isExist = await File.exists({ _id: id });
    if (!isExist) return sendError(res, "File does not exist.", 404);

    const file = await File.findById(id).select("-__v");

    return sendSuccess(res, "Ready to save.", file);
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const isExist = await File.exists({ _id: id });
    if (!isExist) return sendError(res, "File does not exist.", 404);

    const file = await File.findById(id);

    https.get(file?.secure_url!, (fileStream) => fileStream.pipe(res));
  } catch (error) {
    next(error);
  }
};

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, emailFrom, emailTo } = req.body;

  if (!id) return sendError(res, "File id is required.");
  if (!emailFrom) return sendError(res, "Email from is required.");
  if (!emailTo) return sendError(res, "Email to is required.");

  try {
    const isExist = await File.exists({ _id: id });
    if (!isExist) return sendError(res, "File does not exist.", 404);

    const file = await File.findById(id);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      // @ts-ignore
      host: process.env.SENDINBLUE_SMTP_HOST!,
      port: process.env.SENDINBLUE_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDINBLUE_SMTP_USER, // generated ethereal user
        pass: process.env.SENDINBLUE_SMTP_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const mailOptions = {
      from: emailFrom, // sender address
      to: emailTo, // list of receivers
      subject: "File shared with you from Share File 👻", // Subject line
      text: `${emailFrom} shared a file with you`, // plain text body
      html: createEmailTemplate(
        emailFrom,
        emailTo,
        `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file?._id}`,
        file?.originalname,
        `${Math.ceil(file?.size! / 1024)} KB`
      ), // html body
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) return sendError(res, error.message);

      await File.findByIdAndUpdate(id, { sender: emailFrom });
      await File.findByIdAndUpdate(id, { receiver: emailTo });

      return sendSuccess(res, "Email sent successfully!", info);
    });
  } catch (error) {
    next(error);
  }
};
