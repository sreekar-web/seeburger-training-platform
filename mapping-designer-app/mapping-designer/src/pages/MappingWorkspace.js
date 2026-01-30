import { useState } from "react";
import StructureTree from "../components/StructureTree";
import MappingCanvas from "../components/MappingCanvas";
import {
    sourceStructure,
    targetStructure
} from "../data/sampleStructures";

const extractLoopContext = (path) => {
    if (path.includes("PO1_LOOP")) return "PO1";
    if (path.includes("N1_LOOP")) return "N1";
    return null;
};

export default function MappingWorkspace() {
    const [rules, setRules] = useState([]);
    const [selectedRuleId, setSelectedRuleId] = useState(null);

    const handleDropOnCanvas = (source) => {
        const loopContext = extractLoopContext(source.path);

        const newRule = {
            id: `RULE_${rules.length + 1}`,
            sourcePath: source.path,
            targetPath: null,
            loopContext,
            loopScope: "*",
            transform: {
                type: "DIRECT"
            }
        };

        setRules((prev) => [...prev, newRule]);
        setSelectedRuleId(newRule.id);
    };

    const handleTargetSelect = (targetPath) => {
        if (!selectedRuleId) return;

        setRules((prev) =>
            prev.map((r) =>
                r.id === selectedRuleId
                    ? { ...r, targetPath }
                    : r
            )
        );
    };

    const selectedRule = rules.find((r) => r.id === selectedRuleId);

    return (
        <div style={{ display: "flex", height: "100vh" }}>

            {/* SOURCE */}
            <div style={{ width: "25%", borderRight: "1px solid #d1d5db", padding: "12px" }}>
                <h3>Source</h3>
                <StructureTree node={sourceStructure} />
            </div>

            {/* CANVAS */}
            <MappingCanvas
                rules={rules}
                onSelectRule={setSelectedRuleId}
                onDropSource={handleDropOnCanvas}
            />

            {/* TARGET + PROPERTIES */}
            <div style={{ width: "25%", padding: "12px" }}>
                <h3>Target</h3>
                <StructureTree
                    node={targetStructure}
                    isTarget
                    onTargetSelect={handleTargetSelect}
                />

                <hr />

                <h3>Rule Properties</h3>

                {!selectedRule && (
                    <p style={{ color: "#6b7280" }}>
                        Select a rule from the canvas
                    </p>
                )}

                {selectedRule && (
                    <>
                        <div><strong>ID:</strong> {selectedRule.id}</div>
                        <div><strong>FROM:</strong> {selectedRule.sourcePath}</div>
                        <div><strong>TO:</strong> {selectedRule.targetPath || "<select target>"}</div>

                        {selectedRule.loopContext && (
                            <div style={{ marginTop: "6px" }}>
                                <label>
                                    <strong>LOOP:</strong>{" "}
                                    <select
                                        value={selectedRule.loopScope}
                                        onChange={(e) => {
                                            const loopScope = e.target.value;
                                            setRules((prev) =>
                                                prev.map((r) =>
                                                    r.id === selectedRule.id
                                                        ? { ...r, loopScope }
                                                        : r
                                                )
                                            );
                                        }}
                                    >
                                        <option value="*">
                                            {selectedRule.loopContext}[*] (All)
                                        </option>
                                        <option value="1">
                                            {selectedRule.loopContext}[1] (First)
                                        </option>
                                    </select>
                                </label>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}
