import { useState } from "react";

export default function MessageDetails({ message, onBack, onReprocess }) {
    const [activeTab, setActiveTab] = useState("ENVELOPE");

    if (!message) return null;

    const isFailed = message.status === "FAILED";
    const errorType = message.errorType; // ENVELOPE | VALIDATION | MAPPING | null

    // BIS rule: only mapping errors can be reprocessed
    const canReprocess = errorType === "MAPPING";

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={onBack}>⬅ Back to Monitoring</button>

            <h2 style={{ marginTop: "12px" }}>
                Message {message.id}
            </h2>

            <p>
                <strong>Partner:</strong> {message.partner} |{" "}
                <strong>Doc:</strong> {message.docType} |{" "}
                <strong>Direction:</strong> {message.direction}
            </p>

            {/* Tabs */}
            <div style={{ marginTop: "16px" }}>
                {["ENVELOPE", "VALIDATION", "MAPPING", "ACK", "ERROR"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            marginRight: "8px",
                            padding: "6px 12px",
                            backgroundColor: activeTab === tab ? "#2563eb" : "#e5e7eb",
                            color: activeTab === tab ? "#fff" : "#000",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <hr />

            {/* ENVELOPE */}
            {activeTab === "ENVELOPE" && (
                <pre>
                    ISA*00*          *00*          *ZZ*SENDER*ZZ*RECEIVER*...
                    GS*PO*SENDER*RECEIVER*20260123*1200*1*X*004010
                </pre>
            )}

            {/* VALIDATION */}
            {activeTab === "VALIDATION" && (
                <>
                    {errorType === "VALIDATION" ? (
                        <p style={{ color: "red" }}>
                            ❌ Validation failed: Mandatory segment N1 missing
                        </p>
                    ) : (
                        <p style={{ color: "green" }}>
                            ✔ Validation successful
                        </p>
                    )}
                </>
            )}

            {/* MAPPING */}
            {activeTab === "MAPPING" && (
                <>
                    {errorType === "MAPPING" ? (
                        <p style={{ color: "red" }}>
                            ❌ Mapping failed: PO1 loop not generated
                        </p>
                    ) : errorType ? (
                        <p>Mapping not executed due to earlier failure</p>
                    ) : (
                        <p>
                            Mapping MAP_{message.docType}_{message.direction} applied
                        </p>
                    )}
                </>
            )}

            {/* ACK */}
            {activeTab === "ACK" && (
                <p>
                    {isFailed ? "999 Rejected" : "997 Accepted"}
                </p>
            )}

            {/* ERROR */}
            {activeTab === "ERROR" && (
                <>
                    {errorType ? (
                        <pre>
                            STAGE: {errorType}
                            ERROR DETAILS:
                            {errorType === "VALIDATION" && "Missing mandatory segment N1"}
                            {errorType === "MAPPING" && "Target PO1 loop not generated"}
                            {errorType === "ENVELOPE" && "ISA control number mismatch"}
                        </pre>
                    ) : (
                        <p>No errors found</p>
                    )}
                </>
            )}

            {/* REPROCESS LOGIC */}
            {canReprocess ? (
                <button
                    style={{ marginTop: "16px" }}
                    onClick={() => onReprocess(message.id)}
                >
                    🔁 Reprocess Message
                </button>
            ) : isFailed ? (
                <p style={{ marginTop: "16px", color: "#6b7280" }}>
                    Reprocess disabled — partner correction required
                </p>
            ) : null}
        </div>
    );
}
