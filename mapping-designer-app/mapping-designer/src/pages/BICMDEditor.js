import { useRef } from "react";

export default function BICMDEditor({
    bicmd,
    onChange,
    errors,
    onDropSnippet
}) {
    const textareaRef = useRef(null);

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const snippet = e.dataTransfer.getData("application/bicmd-snippet");
                if (!snippet) return;

                const textarea = textareaRef.current;
                const cursorPos = textarea.selectionStart;

                onDropSnippet(snippet, cursorPos);
            }}
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div style={{ padding: "8px", borderBottom: "1px solid #d1d5db" }}>
                <h3>BICMD Mapping Editor</h3>
            </div>

            <textarea
                ref={textareaRef}
                value={bicmd}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                style={{
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: "13px",
                    padding: "12px",
                    outline: "none",
                    border: "none",
                    resize: "none"
                }}
            />

            {errors.length > 0 && (
                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        borderTop: "1px solid #ef4444",
                        padding: "8px",
                        color: "#991b1b"
                    }}
                >
                    <strong>Errors:</strong>
                    <ul>
                        {errors.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
