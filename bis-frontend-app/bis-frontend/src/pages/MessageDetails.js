import { useState } from "react";
import { hasNewerActiveMapping } from "../api/bisRuntimeApi";

const STAGE_ORDER = ["ENVELOPE", "VALIDATION", "MAPPING", "ACK"];

export default function MessageDetails({ message, onBack, onReprocess }) {
    const [activeTab, setActiveTab] = useState("ENVELOPE");

    if (!message) return null;

    const isFailed = message.status === "FAILED";
    const errorType = message.errorType;

    // BIS rule: only mapping errors can be reprocessed
    const canReprocess = errorType === "MAPPING";

    const handleReprocess = () => {
        const mappingId = `MAP_${message.docType}_IN`;

        if (!hasNewerActiveMapping(mappingId, message.mappingVersionUsed)) {
            alert("Reprocess blocked: no newer ACTIVE mapping available");
            return;
        }

        onReprocess(message.id);
    };

    const getTabStyle = (tab) => {
        const tabIndex = STAGE_ORDER.indexOf(tab);
        const currentIndex = STAGE_ORDER.indexOf(message.stage);

        if (tabIndex < currentIndex) {
            return { backgroundColor: "#22c55e", color: "#fff" }; // completed
        }
        if (tab === message.stage) {
            return { backgroundColor: "#2563eb", color: "#fff" }; // current
        }
        return { backgroundColor: "#e5e7eb", color: "#000" }; // future
    };

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

            <p>
                <strong>Stage:</strong> {message.stage}
            </p>

            <p>
                <strong>ACK:</strong>{" "}
                {message.ackCode
                    ? `${message.ackCode} (${message.ackMessage})`
                    : "Pending"}
            </p>

            {/* Tabs */}
            <div style={{ marginTop: "16px" }}>
                {STAGE_ORDER.concat("ERROR").map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            marginRight: "8px",
                            padding: "6px 12px",
                            border: "none",
                            cursor: "pointer",
                            ...getTabStyle(tab)
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
                message.validationErrors && message.validationErrors.length > 0 ? (
                    <ul style={{ color: "red" }}>
                        {message.validationErrors.map((err, idx) => (
                            <li key={idx}>
                                [{err.code}] {err.message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: "green" }}>
                        ✔ Validation successful
                    </p>
                )
            )}


            {/* MAPPING */}
            {activeTab === "MAPPING" && (
                errorType === "MAPPING" ? (
                    <p style={{ color: "red" }}>
                        ❌ Mapping failed: PO1 loop not generated
                    </p>
                ) : errorType ? (
                    <p>Mapping not executed due to earlier failure</p>
                ) : (
                    <p>
                        Mapping MAP_{message.docType}_IN applied
                    </p>
                )
            )}

            {/* ACK */}
            {activeTab === "ACK" && message.ackDetails && (
                <div>
                    <p>
                        <strong>ACK Code:</strong> {message.ackDetails.ackCode}
                    </p>

                    {message.ackDetails.ak3.length > 0 && (
                        <>
                            <h4>AK3 – Segment Errors</h4>
                            <ul>
                                {message.ackDetails.ak3.map((e, i) => (
                                    <li key={i}>
                                        Segment {e.segmentId} – {e.errorCode}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {message.ackDetails.ak4.length > 0 && (
                        <>
                            <h4>AK4 – Element Errors</h4>
                            <ul>
                                {message.ackDetails.ak4.map((e, i) => (
                                    <li key={i}>
                                        Element {e.elementId} – {e.message}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}


            {/* ERROR */}
            {activeTab === "ERROR" && (
                errorType ? (
                    <pre>
                        STAGE: {message.stage}
                        ERROR DETAILS:
                        {errorType === "VALIDATION" && "Missing mandatory segment N1"}
                        {errorType === "MAPPING" && "Target PO1 loop not generated"}
                        {errorType === "ENVELOPE" && "ISA control number mismatch"}
                    </pre>
                ) : (
                    <p>No errors found</p>
                )
            )}

            {/* REPROCESS */}
            {canReprocess ? (
                <button
                    style={{ marginTop: "16px" }}
                    onClick={handleReprocess}
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
