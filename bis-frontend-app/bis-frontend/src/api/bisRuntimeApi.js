import { mappingRegistry } from "../data/mappingRegistry";

export function getActiveMapping(mappingId) {
    const mappings = mappingRegistry[mappingId] || [];
    return mappings.find((m) => m.status === "ACTIVE") || null;
}

export function hasNewerActiveMapping(mappingId, usedVersion) {
    const active = getActiveMapping(mappingId);
    return active && active.version > usedVersion;
}
