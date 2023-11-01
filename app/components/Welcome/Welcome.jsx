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
      <p>Description: Our app currently has a welcome screen as well as a place where
         the user can store their feelings (still needs to be implemented). We also
         have ChatGPT integrated so that users will be able to document their emotions, experience, 
         and feelings, in which that will help the AI to provide feedback towards that user. To
         interact with ChatGPT, go to: <a href="https://my-app-rust-ten.vercel.app/dashboard" style={{ color: 'blue' }}>Dashboard</a>
      </p>
      <button className="diary-button" onClick={onDiaryClick}>
        📓 My diary
      </button>
    </div>
  );
}

export default Welcome;
