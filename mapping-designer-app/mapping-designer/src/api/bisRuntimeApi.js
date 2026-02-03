import { mappingRegistry } from "../data/mappingRegistry";

/**
 * Get latest ACTIVE mapping for a mappingId
 */
export function getActiveMapping(mappingId) {
    const mappings = mappingRegistry[mappingId] || [];
    return mappings.find((m) => m.status === "ACTIVE") || null;
}

/**
 * Publish a new mapping version
 */
export function publishMapping(mappingId, bicmd, version) {
    if (!mappingRegistry[mappingId]) {
        mappingRegistry[mappingId] = [];
    }

    // Supersede old ACTIVE
    mappingRegistry[mappingId].forEach((m) => {
        if (m.status === "ACTIVE") {
            m.status = "SUPERSEDED";
        }
    });

    const newMapping = {
        version,
        status: "ACTIVE",
        bicmd,
        activatedAt: new Date().toISOString()
    };

    mappingRegistry[mappingId].push(newMapping);

    return newMapping;
}

/**
 * Check if a newer ACTIVE mapping exists
 */
export function hasNewerActiveMapping(mappingId, usedVersion) {
    const active = getActiveMapping(mappingId);
    return active && active.version > usedVersion;
}
