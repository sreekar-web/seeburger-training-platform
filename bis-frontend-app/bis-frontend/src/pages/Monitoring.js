import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import InjectMessageModal from "../components/InjectMessageModal";

export default function Monitoring({ filter, onSelectMessage }) {
    const [messages, setMessages] = useState([]);
    const [showInject, setShowInject] = useState(false);

    const loadMessages = () => {
        fetch("http://localhost:4000/api/messages")
            .then(res => res.json())
            .then(setMessages)
            .catch(console.error);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const filteredMessages = messages.filter((msg) => {
        if (filter === "INBOUND") return msg.direction === "INBOUND";
        if (filter === "OUTBOUND") return msg.direction === "OUTBOUND";
        if (filter === "ERRORS") return msg.status === "FAILED";
        return true;
    });

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Monitoring</h2>
                <button onClick={() => setShowInject(true)}>
                    ➕ Inject Message
                </button>
            </div>

            <table width="100%" cellPadding={10}>
                <thead>
                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                        <th>Message ID</th>
                        <th>Partner</th>
                        <th>Doc</th>
                        <th>Direction</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredMessages.map((msg) => (
                        <tr
                            key={msg.id}
                            onClick={() => onSelectMessage(msg)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{msg.id}</td>
                            <td>{msg.partner}</td>
                            <td>{msg.docType}</td>
                            <td>{msg.direction}</td>
                            <td>
                                <StatusBadge status={msg.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showInject && (
                <InjectMessageModal
                    onClose={() => setShowInject(false)}
                    onInjected={loadMessages}
                />
            )}
        </div>
    );
}
