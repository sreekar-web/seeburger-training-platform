import { useState, useEffect } from "react";
import StructureTree from "../components/StructureTree";
import BICMDEditor from "./BICMDEditor";
import { parseBICMD } from "../utils/bicmdParser";
import { sampleInput } from "../data/sampleInput";
import { executeMapping } from "../utils/executeMapping";
import {
    sourceStructure,
    targetStructure
} from "../data/sampleStructures";

export default function MappingWorkspace() {
    const [bicmdText, setBicmdText] = useState(`
RULE RULE_1
  FROM /X12_850/GS/ST/PO1_LOOP/PO1/PO101
  TO   /Order/Items/Item/SKU
  TYPE DIRECT
  LOOP PO1[*]
END
`);

    const [rules, setRules] = useState([]);
    const [errors, setErrors] = useState([]);
    const [preview, setPreview] = useState(null);
    const [runtimeErrors, setRuntimeErrors] = useState([]);

    // 🔹 RULE-AWARE INSERTION
    const insertSnippetRuleAware = (text, snippet) => {
        const lines = text.split("\n");

        const incompleteRuleStart = findLastIncompleteRuleIndex(lines);

        // Case 1: Add to last incomplete RULE
        if (incompleteRuleStart !== null) {
            for (let i = incompleteRuleStart + 1; i < lines.length; i++) {
                if (lines[i].startsWith("END")) {
                    lines.splice(i, 0, "  " + snippet);
                    return lines.join("\n");
                }
            }
        }

        // Case 2: Create new RULE
        const ruleNumber = (text.match(/RULE /g) || []).length + 1;

        return (
            text +
            `\n\nRULE RULE_${ruleNumber}\n` +
            `  ${snippet}\n` +
            `END\n`
        );
    };


    const findLastIncompleteRuleIndex = (lines) => {
        let currentRule = null;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("RULE ")) {
                currentRule = {
                    start: i,
                    hasFrom: false,
                    hasTo: false
                };
            }

            if (currentRule) {
                if (lines[i].trim().startsWith("FROM ")) currentRule.hasFrom = true;
                if (lines[i].trim().startsWith("TO ")) currentRule.hasTo = true;

                if (lines[i].startsWith("END")) {
                    if (!currentRule.hasFrom || !currentRule.hasTo) {
                        return currentRule.start;
                    }
                    currentRule = null;
                }
            }
        }

        return null;
    };


    // 🔹 BICMD → rules + validation
    useEffect(() => {
        const { rules, errors } = parseBICMD(bicmdText);
        setRules(rules);
        setErrors(errors);

        // BIS behavior: preview invalidated on change
        setPreview(null);
        setRuntimeErrors([]);
    }, [bicmdText]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

            {/* TOP: STRUCTURES */}
            <div style={{ display: "flex", height: "40%", borderBottom: "1px solid #d1d5db" }}>

                <div style={{ width: "50%", padding: "8px", overflow: "auto", borderRight: "1px solid #d1d5db" }}>
                    <h4>Source Structure</h4>
                    <StructureTree node={sourceStructure} />
                </div>

                <div style={{ width: "50%", padding: "8px", overflow: "auto" }}>
                    <h4>Target Structure</h4>
                    <StructureTree node={targetStructure} isTarget />
                </div>
            </div>

            {/* PREVIEW BUTTON */}
            <button
                disabled={errors.length > 0}
                onClick={() => {
                    const { output, runtimeErrors } = executeMapping(rules, sampleInput);
                    setPreview(output);
                    setRuntimeErrors(runtimeErrors);
                }}
                style={{
                    margin: "6px",
                    opacity: errors.length > 0 ? 0.5 : 1,
                    cursor: errors.length > 0 ? "not-allowed" : "pointer"
                }}
            >
                ▶ Run Mapping Preview
            </button>

            {/* BICMD EDITOR */}
            <div style={{ flex: 1 }}>
                <BICMDEditor
                    bicmd={bicmdText}
                    onChange={setBicmdText}
                    errors={errors}
                    onDropSnippet={(snippet) => {
                        setBicmdText(prev =>
                            insertSnippetRuleAware(prev, snippet)
                        );
                    }}
                />
            </div>

            {/* PREVIEW OUTPUT */}
            {preview && (
                <div style={{ padding: "8px", borderTop: "1px solid #d1d5db" }}>
                    <h4>Execution Preview</h4>
                    <pre>{JSON.stringify(preview, null, 2)}</pre>

                    {runtimeErrors.length > 0 && (
                        <div style={{ color: "red" }}>
                            <h4>Runtime Errors</h4>
                            <ul>
                                {runtimeErrors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
