import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/files";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);

export default router;
