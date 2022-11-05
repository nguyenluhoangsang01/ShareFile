import { Response } from "express";

const sendSuccess = (
  res: Response,
  message: string,
  data: object | null = null,
  code: number = 200
) => {
  if (data) {
    return res.status(code).json({
      status: code,
      success: true,
      message,
      data,
    });
  } else {
    return res.status(code).json({
      status: code,
      success: true,
      message,
    });
  }
};

export default sendSuccess;
