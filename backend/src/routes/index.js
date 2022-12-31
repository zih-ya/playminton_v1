import { Router } from "express";
import playRouter from "./play.js";

const router = Router();
router.use("/", playRouter);

export default router;
