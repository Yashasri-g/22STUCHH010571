import React from "react";
import "./App.css";
import { logToBackend } from "./utils/logger";

const App: React.FC = () => {
  const handleLogClick = () => {
    logToBackend("INFO", {
      message: "User clicked the log button",
      additionalInfo: "Button click event in App component"
    });
  };

  return (
    <div className="App">
      <h1>Logging Middleware Demo</h1>
      <button onClick={handleLogClick}>Send Log</button>
    </div>
  );
};

export default App;
