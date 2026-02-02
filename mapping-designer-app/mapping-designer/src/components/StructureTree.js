import { useState } from "react";

export default function StructureTree({
    node,
    path = "",
    isTarget = false
}) {
    const [expanded, setExpanded] = useState(false);

    const currentPath = path ? `${path}/${node.name}` : `/${node.name}`;
    const hasChildren = node.children && node.children.length > 0;

    const handleDragStart = (e) => {
        let snippet = "";

        // SOURCE → FROM
        if (!isTarget && node.type === "ELEMENT") {
            snippet = `FROM ${currentPath}`;
        }

        // TARGET → TO
        if (isTarget && node.type === "FIELD") {
            snippet = `TO   ${currentPath}`;
        }

        if (!snippet) return;

        e.dataTransfer.setData(
            "application/bicmd-snippet",
            snippet
        );
    };

    return (
        <div style={{ marginLeft: "16px" }}>
            <div
                draggable={
                    (!isTarget && node.type === "ELEMENT") ||
                    (isTarget && node.type === "FIELD")
                }
                onDragStart={handleDragStart}
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{
                    cursor: "pointer",
                    padding: "2px",
                    backgroundColor:
                        isTarget && node.type === "FIELD" ? "#f0f9ff" : "transparent"
                }}
            >
                {hasChildren && (expanded ? "▼ " : "▶ ")}
                <strong>{node.name}</strong>{" "}
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {node.type}
                    {node.mandatory ? " (M)" : ""}
                    — {currentPath}
                </span>
            </div>

            {expanded &&
                hasChildren &&
                node.children.map((child, idx) => (
                    <StructureTree
                        key={idx}
                        node={child}
                        path={currentPath}
                        isTarget={isTarget}
                    />
                ))}
        </div>
    );
}
