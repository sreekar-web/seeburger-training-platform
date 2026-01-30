import { useState } from "react";

export default function StructureTree({
    node,
    path = "",
    onDrop,
    isTarget = false
}) {
    const [expanded, setExpanded] = useState(false);

    const currentPath = path ? `${path}/${node.name}` : `/${node.name}`;
    const hasChildren = node.children && node.children.length > 0;

    const handleDragStart = (e) => {
        e.dataTransfer.setData(
            "application/mapping-source",
            JSON.stringify({
                name: node.name,
                type: node.type,
                path: currentPath
            })
        );
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(
            e.dataTransfer.getData("application/mapping-source")
        );
        onDrop && onDrop(data, currentPath);
    };

    return (
        <div style={{ marginLeft: "16px" }}>
            <div
                draggable={!isTarget}
                onDragStart={!isTarget ? handleDragStart : undefined}
                onDragOver={isTarget ? (e) => e.preventDefault() : undefined}
                onDrop={isTarget ? handleDrop : undefined}
                style={{
                    cursor: "pointer",
                    padding: "2px",
                    backgroundColor: isTarget ? "#f0f9ff" : "transparent"
                }}
                onClick={() => hasChildren && setExpanded(!expanded)}
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
                        onDrop={onDrop}
                        isTarget={isTarget}
                    />
                ))}
        </div>
    );
}
