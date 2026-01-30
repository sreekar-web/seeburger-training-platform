export default function StatusBadge({ status }) {
    const colors = {
        SUCCESS: "green",
        FAILED: "red",
        WAITING: "orange"
    };

    return (
        <span
            style={{
                color: "#fff",
                backgroundColor: colors[status],
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px"
            }}
        >
            {status}
        </span>
    );
}
