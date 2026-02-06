import { useState } from "react";

export default function InjectMessageModal({ onClose, onInjected }) {
    const [partner, setPartner] = useState("Walmart");
    const [docType, setDocType] = useState("850");
    const [direction, setDirection] = useState("INBOUND");

    const handleSubmit = () => {
        const payload = {
            id: `MSG_${Date.now()}`,
            partner,
            docType,
            direction
        };

        fetch("http://localhost:4000/messages/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                onInjected();
                onClose();
            })
            .catch(() => {
                alert("Failed to inject message");
            });
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div style={{ background: "#fff", padding: "20px", width: "320px" }}>
                <h3>Inject Message</h3>

                <label>Partner</label>
                <input value={partner} onChange={e => setPartner(e.target.value)} />

                <label>Doc Type</label>
                <input value={docType} onChange={e => setDocType(e.target.value)} />

                <label>Direction</label>
                <select value={direction} onChange={e => setDirection(e.target.value)}>
                    <option value="INBOUND">INBOUND</option>
                    <option value="OUTBOUND">OUTBOUND</option>
                </select>

                <div style={{ marginTop: "12px" }}>
                    <button onClick={handleSubmit}>Inject</button>
                    <button onClick={onClose} style={{ marginLeft: "8px" }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
