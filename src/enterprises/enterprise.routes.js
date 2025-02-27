import { Router } from "express";
import {validateJWT} from "../middlewares/validate-jwt.js"
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { getEnterprise, saveEnterprise, updateEnterprise } from "./enterprise.controller.js";
const router = Router();

router.post(
    "/",
    [
        validateJWT,
        validateFields    
    ],
    saveEnterprise
)

router.get(
    "/",
    getEnterprise
)

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "not is a valid ID").isMongoId(),
        validateFields
    ],
    updateEnterprise
)

export default router;