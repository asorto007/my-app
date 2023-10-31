// Welcome.jsx
"use client";
import React from "react";
import "./welcome.css";
/* eslint-disable react/prop-types */

function Welcome({ onDiaryClick }) {
  return (
    <div>
      <h1>GitWell</h1>
      <p>Take care of your mental health right now</p>
      <button className="diary-button" onClick={onDiaryClick}>
        📓 My diary
      </button>
    </div>
  );
}

export default Welcome;
