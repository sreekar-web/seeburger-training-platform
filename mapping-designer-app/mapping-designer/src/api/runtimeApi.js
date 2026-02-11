const BASE_URL = "http://localhost:4000/api";

export async function publishMapping(mapping) {
    const res = await fetch(`${BASE_URL}/mappings/publish`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mapping)
    });

    if (!res.ok) {
        throw new Error("Publish failed");
    }

    return res.json();
}

export async function activateMapping(mappingId) {
    const res = await fetch(`${BASE_URL}/mappings/activate/${mappingId}`, {
        method: "POST"
    });

    if (!res.ok) {
        throw new Error("Activate failed");
    }

    return res.json();
}
