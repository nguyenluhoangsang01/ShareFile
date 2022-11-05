import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import fileRoutes from "./routes/files";

const app: Express = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

dotenv.config();

// Configure express
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.DEV === "dev"
        ? process.env.API_BASE_ENDPOINT_CLIENT
        : [`http://${HOST}`, `https://${HOST}`],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}/api`)
);

// Configure mongoose
mongoose.connect(`${process.env.MONGO_URI}`, () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}));
const db = mongoose.connection;
db.on("connected", () => console.log("⚡️[server]: Connected to the database"));
db.on("disconnected", () =>
  console.log("⚡️[server]: Disconnected to database")
);
db.on("error", ({ message }) =>
  console.error(`⚡️[server]: Error connecting to database: ${message}`)
);

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Routes
app.use("/api/files", fileRoutes);

app.use("/*", (_, res) => {
  res.status(501).send("Not Implemented.");
});
