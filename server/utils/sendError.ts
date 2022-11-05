import { Response } from "express";

const sendError = (res: Response, message: string, code: number = 400) =>
  res.status(code).json({
    status: code,
    success: false,
    message,
  });

export default sendError;
