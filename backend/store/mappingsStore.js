// backend/store/mappingStore.js

const mappings = []; // all versions
const activeMappings = new Map(); // docType → mappingId

export function addMapping(mapping) {
    mappings.push(mapping);
}

export function getMappings() {
    return mappings;
}

export function getMappingById(id) {
    return mappings.find(m => m.id === id);
}

export function activateMapping(id) {
    const mapping = getMappingById(id);
    if (!mapping) return null;

    activeMappings.set(mapping.docType, id);
    return mapping;
}

export function getActiveMapping(docType) {
    const id = activeMappings.get(docType);
    if (!id) return null;
    return getMappingById(id);
}
