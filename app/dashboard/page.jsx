// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";c
// "use client";
import React from "react";
import SubmitChat from "../components/submitChat.jsx";
import ChatComponent from "../components/ChatComponent.jsx";
import OpenAI from "openai";

function SubmissionForm() {
  return (
    <main>
      <ChatComponent />
    </main>
  );
}

export default SubmissionForm;
