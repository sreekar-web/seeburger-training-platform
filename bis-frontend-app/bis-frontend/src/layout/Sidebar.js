export default function Sidebar({ onSelect }) {
    return (
        <div
            style={{
                width: "230px",
                backgroundColor: "#1f2933",
                color: "#ffffff",
                padding: "12px"
            }}
        >
            <h3 style={{ marginBottom: "20px" }}>BIS Front End</h3>

            <div>
                <strong>Monitoring</strong>
                <ul style={{ listStyle: "none", paddingLeft: "16px" }}>
                    <li onClick={() => onSelect("ALL")}>All</li>
                    <li onClick={() => onSelect("INBOUND")}>Inbound</li>
                    <li onClick={() => onSelect("OUTBOUND")}>Outbound</li>
                    <li onClick={() => onSelect("ERRORS")}>Errors</li>
                </ul>
            </div>

            <div style={{ marginTop: "12px" }}>
                <strong>Trading Partners</strong>
            </div>

            <div style={{ marginTop: "12px" }}>
                <strong>Acknowledgements</strong>
            </div>
        </div>
    );
}
