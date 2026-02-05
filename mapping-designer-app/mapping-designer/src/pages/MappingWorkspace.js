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
import { publishMapping, activateMapping } from "../api/runtimeApi";

export default function MappingWorkspace() {
    const mappingId = "MAP_850_IN";

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
    const [currentVersion, setCurrentVersion] = useState(1);
    const [status, setStatus] = useState("DRAFT");

    // Parse BICMD → rules
    useEffect(() => {
        const { rules, errors } = parseBICMD(bicmdText);
        setRules(rules);
        setErrors(errors);

        // BIS behavior: preview invalidated on change
        setPreview(null);
        setRuntimeErrors([]);
    }, [bicmdText]);

    const handlePublishAndActivate = async () => {
        if (errors.length > 0) {
            alert("Cannot publish mapping with BICMD errors");
            return;
        }

        const mappingPayload = {
            id: `${mappingId}_v${currentVersion}`,
            docType: "850",
            version: currentVersion,
            bicmd: bicmdText,
            rules,
            active: false
        };

        try {
            await publishMapping(mappingPayload);
            await activateMapping(mappingPayload.id);

            setStatus("ACTIVE");
            setCurrentVersion((v) => v + 1);

            alert(
                `Mapping ${mappingId} v${mappingPayload.version} published and activated`
            );
        } catch (err) {
            console.error(err);
            alert("Failed to publish mapping to backend");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

            {/* HEADER */}
            <div
                style={{
                    padding: "8px",
                    borderBottom: "1px solid #d1d5db",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <strong>
                    Mapping: {mappingId} | Status: {status} | Next Version: v{currentVersion}
                </strong>

                <button
                    style={{ marginLeft: "16px" }}
                    onClick={handlePublishAndActivate}
                >
                    🚀 Publish & Activate
                </button>
            </div>

            {/* TOP: SOURCE + TARGET STRUCTURES */}
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
                    setRuntimeErrors(runtimeErrors || []);
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
