const BASE_URL = "http://localhost:4000/api";

export async function publishMapping(mapping) {
    const res = await fetch(`${BASE_URL}/mappings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mapping)
    });

    return res.json();
}

export async function activateMapping(mappingId) {
    const res = await fetch(`${BASE_URL}/mappings/${mappingId}/activate`, {
        method: "POST"
    });

    return res.json();
}
