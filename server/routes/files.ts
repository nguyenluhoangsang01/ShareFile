import express from "express";
import multer from "multer";
import { getFile, uploadFile } from "../controllers/files";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);

router.get("/:id", getFile);

export default router;
