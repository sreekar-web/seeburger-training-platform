export default function MappingCanvas({ rules, onSelectRule, onDropSource }) {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const data = e.dataTransfer.getData("application/mapping-source");
        if (!data) return;

        const source = JSON.parse(data);
        onDropSource(source);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                flex: 1,
                backgroundColor: "#f8fafc",
                borderLeft: "1px solid #d1d5db",
                borderRight: "1px solid #d1d5db",
                padding: "12px",
                overflow: "auto"
            }}
        >
            <h3>Mapping Canvas</h3>

            {rules.length === 0 && (
                <p style={{ color: "#6b7280" }}>
                    Drag source fields into the canvas to start mapping
                </p>
            )}

            {rules.map((r) => (
                <div
                    key={r.id}
                    onClick={() => onSelectRule(r.id)}
                    style={{
                        border: "1px solid #9ca3af",
                        backgroundColor: "#fff",
                        padding: "8px",
                        marginBottom: "8px",
                        cursor: "pointer"
                    }}
                >
                    <div><strong>{r.id}</strong></div>
                    <div style={{ fontSize: "12px" }}>
                        {r.sourcePath} → {r.targetPath || "<select target>"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {r.transform.type}
                        {r.loopContext && ` | ${r.loopContext}[${r.loopScope}]`}
                    </div>
                </div>
            ))}
        </div>
    );
}
