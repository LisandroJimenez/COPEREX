import { Router } from "express";
import { generateReport } from "./report.js";

const router = Router()

router.get(
    "/",
    generateReport
)

export default router;