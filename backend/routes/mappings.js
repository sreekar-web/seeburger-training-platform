import express from "express";
import {
    addMapping,
    getMappings,
    activateMapping,
    getActiveMapping
} from "../store/mappingsStore.js";

const router = express.Router();

/**
 * POST /api/mappings/publish
 */
router.post("/publish", (req, res) => {
    const mapping = req.body;

    if (!mapping.id || !mapping.docType || !mapping.version) {
        return res.status(400).json({ error: "Invalid mapping payload" });
    }

    addMapping(mapping);
    res.json({ success: true });
});

/**
 * POST /api/mappings/activate/:id
 */
router.post("/activate/:id", (req, res) => {
    const activated = activateMapping(req.params.id);

    if (!activated) {
        return res.status(404).json({ error: "Mapping not found" });
    }

    res.json({ success: true, active: activated });
});

/**
 * GET /api/mappings/active/:docType
 */
router.get("/active/:docType", (req, res) => {
    const mapping = getActiveMapping(req.params.docType);
    res.json(mapping);
});

/**
 * GET /api/mappings
 */
router.get("/", (req, res) => {
    res.json(getMappings());
});

export default router;
