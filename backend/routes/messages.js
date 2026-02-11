import express from "express";

import { getActiveMapping } from "../store/mappingsStore.js";
import { executeValidation } from "../utils/executeValidation.js";
import { executeMapping } from "../utils/executeMapping.js";
import { generateAck } from "../utils/generateAck.js";

import {
    addMessage,
    getMessages,
    getMessageById,
    updateMessage
} from "../store/messageStore.js";

const router = express.Router();

/**
 * POST /api/messages/process
 * Runtime ingestion
 */
router.post("/process", (req, res) => {
    const incoming = req.body;

    let status = "SUCCESS";
    let stage = "VALIDATION";
    let errorType = null;
    let mappingVersionUsed = null;
    let mappingResult = { runtimeErrors: [] };

    // 1️⃣ VALIDATION
    const validationResult = executeValidation(incoming);

    if (!validationResult.isValid) {
        status = "FAILED";
        errorType = "VALIDATION";
    }

    // 2️⃣ MAPPING (only if validation passed)
    if (status === "SUCCESS") {
        stage = "MAPPING";

        const activeMapping = getActiveMapping(incoming.docType);

        if (!activeMapping) {
            status = "FAILED";
            errorType = "MAPPING";
        } else {
            mappingResult = executeMapping(activeMapping.rules, incoming);

            if (mappingResult.runtimeErrors?.length > 0) {
                status = "FAILED";
                errorType = "MAPPING";
            } else {
                mappingVersionUsed = activeMapping.version;
            }
        }
    }

    // 3️⃣ ACK
    stage = "ACK";
    const ack = generateAck(incoming, validationResult, mappingResult);

    const storedMessage = {
        id: incoming.id,
        partner: incoming.partner,
        docType: incoming.docType,
        direction: incoming.direction,
        status,
        stage,
        errorType,
        mappingVersionUsed,
        ack,
        createdAt: new Date().toISOString()
    };

    addMessage(storedMessage);

    res.json(storedMessage);
});

/**
 * GET /api/messages
 */
router.get("/", (req, res) => {
    res.json(getMessages());
});

/**
 * POST /api/messages/reprocess/:id
 */
router.post("/reprocess/:id", (req, res) => {
    const msg = getMessageById(req.params.id);

    if (!msg) {
        return res.status(404).json({ error: "Message not found" });
    }

    if (msg.errorType !== "MAPPING") {
        return res.status(400).json({
            error: "Reprocess allowed only for mapping errors"
        });
    }

    const activeMapping = getActiveMapping(msg.docType);

    if (!activeMapping) {
        return res.status(400).json({
            error: "No active mapping available"
        });
    }

    const mappingResult = executeMapping(activeMapping.rules, msg);

    if (mappingResult.runtimeErrors?.length > 0) {
        return res.json(msg); // still failing
    }

    const ack = generateAck(msg, { isValid: true }, mappingResult);

    const updated = updateMessage(msg.id, {
        status: "SUCCESS",
        stage: "ACK",
        errorType: null,
        mappingVersionUsed: activeMapping.version,
        ack
    });

    res.json(updated);
});

export default router;
