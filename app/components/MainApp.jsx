"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome/Welcome.jsx";
import Journal from "./Journal/Journal.jsx"; // Ensure you've imported the Journal component
import "./global.css";

function MainApp() {
  const [showJournal, setShowJournal] = useState(false);

  return (
    <div className="app-container">
      {showJournal ? (
        <Journal onGoBackClick={() => setShowJournal(false)} />
      ) : (
        <Welcome onDiaryClick={() => setShowJournal(true)} />
      )}
    </div>
  );
}

export default MainApp;
