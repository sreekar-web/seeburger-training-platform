import express from "express";
import { executeValidation } from "../utils/executeValidation.js";
import { executeMapping } from "../utils/executeMapping.js";
import { generateAck } from "../utils/generateAck.js";
import { getActiveMapping } from "../store/mappingsStore.js";

const router = express.Router();

router.post("/process", (req, res) => {
    const { message, input } = req.body;

    const validation = executeValidation(message);

    if (!validation.isValid) {
        const ack = generateAck(message, validation, null);

        return res.json({
            stage: "VALIDATION",
            status: "FAILED",
            ack
        });
    }

    const mapping = getActiveMapping(message.docType);

    if (!mapping) {
        return res.json({
            stage: "MAPPING",
            status: "FAILED",
            error: "No active mapping found"
        });
    }

    const mappingResult = executeMapping(mapping.rules, input);

    const ack = generateAck(message, validation, mappingResult);

    res.json({
        stage: "ACK",
        status: "SUCCESS",
        output: mappingResult.output,
        ack
    });
});

export default router;
