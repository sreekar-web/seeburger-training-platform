import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import { sampleInput } from "./data/sampleInput";
import Monitoring from "./pages/Monitoring";
import MessageDetails from "./pages/MessageDetails";
import { executeValidation } from "./utils/executeValidation";
import { generateAck } from "./utils/generateAck";


const INITIAL_MESSAGES = [
  {
    id: "MSG001",
    partner: "Walmart",
    docType: "850",
    direction: "INBOUND",
    status: "FAILED",
    stage: "VALIDATION",
    errorType: "VALIDATION"
  },
  {
    id: "MSG002",
    partner: "CVS",
    docType: "810",
    direction: "OUTBOUND",
    status: "SUCCESS",
    stage: "ACK",
    errorType: null,
    ackCode: "997",
    ackMessage: "Accepted"
  },
  {
    id: "MSG003",
    partner: "Target",
    docType: "856",
    direction: "INBOUND",
    status: "WAITING",
    stage: "ENVELOPE",
    errorType: null
  },
  {
    id: "MSG004",
    partner: "Amazon",
    docType: "850",
    direction: "OUTBOUND",
    status: "FAILED",
    stage: "MAPPING",
    errorType: "MAPPING",
    mappingVersionUsed: 1,
    ackCode: "999",
    ackMessage: "Rejected"
  }
];

function App() {
  const [filter, setFilter] = useState("ALL");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // BIS runtime reprocess
  const handleReprocess = (messageId) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;

        const validation = executeValidation(
          sampleInput,
          msg.partner,
          msg.docType
        );

        if (!validation.isValid) {
          const ack = generateAck({
            partner: msg.partner,
            docType: msg.docType,
            validationErrors: validation.errors,
            success: false
          });

          return {
            ...msg,
            stage: "VALIDATION",
            status: "FAILED",
            errorType: "VALIDATION",
            validationErrors: validation.errors,
            ackCode: ack.ackCode,
            ackDetails: ack
          };
        }

        const ack = generateAck({
          partner: msg.partner,
          docType: msg.docType,
          success: true
        });

        return {
          ...msg,
          stage: "ACK",
          status: "SUCCESS",
          errorType: null,
          validationErrors: [],
          ackCode: ack.ackCode,
          ackDetails: ack
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
