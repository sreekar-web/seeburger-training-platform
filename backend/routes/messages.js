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

    if (!validationResult.valid) {
        status = "FAILED";
        errorType = "VALIDATION";
    }

    // 2️⃣ MAPPING (only if validation passed)
    let mappingResult = null;
    if (status === "SUCCESS") {
        stage = "MAPPING";
        mappingResult = executeMapping(incoming);

        if (!mappingResult.success) {
            status = "FAILED";
            errorType = "MAPPING";
        } else {
            mappingVersionUsed = mappingResult.mappingVersion;
        }
    }

    // 3️⃣ ACK
    stage = "ACK";
    const ack = generateAck({
        status,
        errorType
    });

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
 * ✅ GET /messages
 * Returns all processed messages (Monitoring screen)
 */
router.get("/", (req, res) => {
    res.json(getMessages());
});

/**
 * POST /messages/reprocess/:id
 * Reprocesses a FAILED message (mapping errors only)
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

    // Re-run mapping
    const mappingResult = executeMapping(msg);

    if (!mappingResult.success) {
        return res.json(msg); // still failed
    }

    const ack = generateAck({
        status: "SUCCESS",
        errorType: null
    });

    const updated = updateMessage(msg.id, {
        status: "SUCCESS",
        stage: "ACK",
        errorType: null,
        mappingVersionUsed: mappingResult.mappingVersion,
        ack
    });

    res.json(updated);
});

// GET all messages (for Monitoring UI)
router.get("/", (req, res) => {
    res.json(messages); // messages = in-memory store
});

export default router;
