import express from "express";
import multer from "multer";
import {
  downloadFile,
  getFile,
  sendEmail,
  uploadFile,
} from "../controllers/files";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);

router.get("/:id", getFile);

router.get("/:id/download", downloadFile);

router.post("/email", sendEmail);

export default router;
