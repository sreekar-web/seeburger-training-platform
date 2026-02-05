import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Monitoring from "./pages/Monitoring";
import MessageDetails from "./pages/MessageDetails";

function App() {
  const [filter, setFilter] = useState("ALL");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleReprocessUpdate = (updatedMessage) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === updatedMessage.id ? updatedMessage : m
      )
    );
    setSelectedMessage(updatedMessage);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelect={setFilter} />

      <div style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        {selectedMessage ? (
          <MessageDetails
            message={selectedMessage}
            onBack={() => setSelectedMessage(null)}
            onReprocessUpdate={handleReprocessUpdate}
          />
        ) : (
          <Monitoring
            filter={filter}
            messages={messages}
            setMessages={setMessages}
            onSelectMessage={setSelectedMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
