import StructureTree from "../components/StructureTree";
import {
    sourceStructure,
    targetStructure
} from "../data/sampleStructures";

export default function StructureExplorer() {
    return (
        <div style={{ display: "flex", height: "100vh" }}>

            {/* SOURCE */}
            <div
                style={{
                    width: "50%",
                    borderRight: "1px solid #d1d5db",
                    padding: "12px",
                    overflow: "auto"
                }}
            >
                <h3>Source Structure (X12 850)</h3>
                <StructureTree node={sourceStructure} />
            </div>

            {/* TARGET */}
            <div
                style={{
                    width: "50%",
                    padding: "12px",
                    overflow: "auto"
                }}
            >
                <h3>Target Structure (XML)</h3>
                <StructureTree node={targetStructure} />
            </div>

        </div>
    );
}
