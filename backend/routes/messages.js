import express from "express";

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
 * POST /messages/process
 * Simulates BIS runtime message ingestion
 */
router.post("/process", (req, res) => {
    const incoming = req.body;

    let status = "SUCCESS";
    let stage = "VALIDATION";
    let errorType = null;
    let mappingVersionUsed = null;

    // 1️⃣ VALIDATION
    const validationResult = executeValidation(incoming);

    if (!validationResult.isValid) {
        status = "FAILED";
        errorType = "VALIDATION";
    }

    // 2️⃣ MAPPING
    let mappingResult = { runtimeErrors: [] };
    if (status === "SUCCESS") {
        stage = "MAPPING";
        mappingResult = executeMapping([], incoming);

        if (mappingResult.runtimeErrors && mappingResult.runtimeErrors.length > 0) {
            status = "FAILED";
            errorType = "MAPPING";
        } else {
            mappingVersionUsed = "v1-latest";
        }
    }

    // 3️⃣ ACK
    stage = "ACK";
    const ack = generateAck(incoming, validationResult, mappingResult);

    // 4️⃣ STORE MESSAGE
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
 * GET /messages
 * Monitoring screen
 */
router.get("/", (req, res) => {
    res.json(getMessages());
});

/**
 * POST /messages/reprocess/:id
 * Reprocess mapping failures only
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

    const mappingResult = executeMapping([], msg);

    if (mappingResult.runtimeErrors && mappingResult.runtimeErrors.length > 0) {
        return res.json(msg);
    }

    const ack = generateAck(msg, { isValid: true }, mappingResult);

    const updated = updateMessage(msg.id, {
        status: "SUCCESS",
        stage: "ACK",
        errorType: null,
        mappingVersionUsed: mappingResult.mappingVersion,
        ack
    });

    res.json(updated);
});

export default router;
