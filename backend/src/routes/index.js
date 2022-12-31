import { Router } from "express";
import playRouter from "./play.js";

const router = Router();
router.use("/api", playRouter);

export default router;
