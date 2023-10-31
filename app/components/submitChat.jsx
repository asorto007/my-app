"use client";
import React, { useState } from "react";

const SubmitChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [submissions, setSubmissions] = useState([]);

  async function createUserPrompt(incomingPrompt) {
    const inputPrompt = incomingPrompt;
    const payload = {
      prompt: incomingPrompt,
    };

    const response = await fetch("/api/getChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status != 200) {
      console.log("Error: " + response.status);
      return false;
    }
    const jsonData = await response.json();
    // console.log(jsonData.text);
    console.log(jsonData.text);
    setSubmissions([...submissions, jsonData.text]);
    setInputValue("");
    if (jsonData.msg == true) {
      console.log(jsonData.text);
      setSubmissions([...submissions, jsonData.text]);
      setInputValue("");
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      createUserPrompt(inputValue);

      setSubmissions([...submissions, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div>
      <h1>Submission Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {submissions.map((submission, index) => (
          <li key={index}>{submission}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubmitChat;
