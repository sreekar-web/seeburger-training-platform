import { useState } from "react";

const initialMappings = [
    {
        mappingId: "MAP_850_IN",
        docType: "850",
        direction: "INBOUND",
        version: 1
    }
];

export default function MappingList() {
    const [mappings, setMappings] = useState(initialMappings);

    const publishMapping = async (mappingId) => {
        const updated = await window.mappingAPI.publishMapping(mappingId);

        setMappings((prev) =>
            prev.map((m) =>
                m.mappingId === mappingId
                    ? { ...m, version: updated.version }
                    : m
            )
        );

        alert(`Mapping ${mappingId} published (v${updated.version})`);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Mappings</h2>

            <table width="100%" cellPadding={10}>
                <thead>
                    <tr>
                        <th>Mapping ID</th>
                        <th>Doc</th>
                        <th>Direction</th>
                        <th>Version</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {mappings.map((m) => (
                        <tr key={m.mappingId}>
                            <td>{m.mappingId}</td>
                            <td>{m.docType}</td>
                            <td>{m.direction}</td>
                            <td>{m.version}</td>
                            <td>
                                <button onClick={() => publishMapping(m.mappingId)}>
                                    📦 Publish
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
