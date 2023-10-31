// Journal.jsx
"use client";
import React from "react";
import "./journal.css"; // Assuming you have a journal.css
/* eslint-disable react/prop-types */

function Journal({ onGoBackClick }) {
  return (
    <div>
      <h1>My Journal</h1>
      {/* ... other contents of the Journal ... */}
      <button className="diary-button" onClick={onGoBackClick}>
        Go Back
      </button>
    </div>
  );
}

export default Journal;
