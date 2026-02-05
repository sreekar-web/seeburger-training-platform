import express from "express";
import {
    saveMapping,
    activateMapping,
    getAllMappings
} from "../store/mappingsStore.js";

const router = express.Router();

router.post("/", (req, res) => {
    saveMapping(req.body);
    res.json({ status: "MAPPING_SAVED" });
});

router.post("/:id/activate", (req, res) => {
    activateMapping(req.params.id);
    res.json({ status: "MAPPING_ACTIVATED" });
});

router.get("/", (req, res) => {
    res.json(getAllMappings());
});

export default router;
