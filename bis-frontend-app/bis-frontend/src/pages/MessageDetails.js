import { useState } from "react";

export default function MessageDetails({
    message,
    onBack,
    onReprocessUpdate
}) {
    const [activeTab, setActiveTab] = useState("ENVELOPE");

    if (!message) return null;

    const handleReprocess = () => {
        fetch(`http://localhost:4000/api/messages/reprocess/${message.id}`, {
            method: "POST"
        })
            .then((res) => res.json())
            .then((updated) => {
                onReprocessUpdate(updated);
            })
            .catch(() => {
                alert("Reprocess failed");
            });
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
                <strong>ACK:</strong>{" "}
                {message.ack
                    ? `${message.ack.code} (${message.ack.message})`
                    : "Pending"}
            </p>

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

            {activeTab === "ACK" && (
                <pre>{JSON.stringify(message.ack, null, 2)}</pre>
            )}

            {message.errorType === "MAPPING" && (
                <button
                    style={{ marginTop: "16px" }}
                    onClick={handleReprocess}
                >
                    🔁 Reprocess Message
                </button>
            )}
        </div>
    );
}
