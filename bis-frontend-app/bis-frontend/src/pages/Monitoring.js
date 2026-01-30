import StatusBadge from "../components/StatusBadge";

const ALL_MESSAGES = [
    {
        id: "MSG001",
        partner: "Walmart",
        docType: "850",
        direction: "INBOUND",
        status: "FAILED",
        errorType: "VALIDATION"
    },
    {
        id: "MSG002",
        partner: "CVS",
        docType: "810",
        direction: "OUTBOUND",
        status: "SUCCESS",
        errorType: null
    },
    {
        id: "MSG003",
        partner: "Target",
        docType: "856",
        direction: "INBOUND",
        status: "WAITING",
        errorType: null
    },
    {
        id: "MSG004",
        partner: "Amazon",
        docType: "850",
        direction: "OUTBOUND",
        status: "FAILED",
        errorType: "MAPPING"
    }
];

export default function Monitoring({ filter, messages, onSelectMessage }) {
    const filteredMessages = messages.filter((msg) => {
        if (filter === "INBOUND") return msg.direction === "INBOUND";
        if (filter === "OUTBOUND") return msg.direction === "OUTBOUND";
        if (filter === "ERRORS") return msg.status === "FAILED";
        return true;
    });

    return (
        <div style={{ padding: "20px" }}>
            <h2>Monitoring</h2>

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
        </div>
    );
}
