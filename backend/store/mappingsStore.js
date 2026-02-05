let mappings = [];

export function saveMapping(mapping) {
    mappings.push(mapping);
}

export function activateMapping(mappingId) {
    mappings = mappings.map(m => ({
        ...m,
        active: m.id === mappingId
    }));
}

export function getActiveMapping(docType) {
    return mappings.find(m => m.docType === docType && m.active);
}

export function getAllMappings() {
    return mappings;
}
