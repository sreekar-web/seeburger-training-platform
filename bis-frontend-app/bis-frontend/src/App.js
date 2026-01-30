import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Monitoring from "./pages/Monitoring";
import MessageDetails from "./pages/MessageDetails";

const INITIAL_MESSAGES = [
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
    errorType: "MAPPING",
    mappingVersionUsed: 1
  }
];

function App() {
  const [filter, setFilter] = useState("ALL");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleReprocess = async (messageId) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    const mappingId = `MAP_${msg.docType}_IN`;

    const latest = await window.mappingAPI.getLatestMapping(mappingId);

    if (msg.mappingVersionUsed >= latest.version) {
      alert("Reprocess blocked: mapping not updated yet");
      return;
    }

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;

        return {
          ...m,
          status: "SUCCESS",
          errorType: null,
          mappingVersionUsed: latest.version
        };
      })
    );

    setSelectedMessage(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelect={setFilter} />

      <div style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        {selectedMessage ? (
          <MessageDetails
            message={selectedMessage}
            onBack={() => setSelectedMessage(null)}
            onReprocess={handleReprocess}
          />
        ) : (
          <Monitoring
            filter={filter}
            messages={messages}
            onSelectMessage={setSelectedMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
