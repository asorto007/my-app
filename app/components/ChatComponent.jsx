"use client";
import React, { useState } from "react";

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);

    // Simulate API call to ChatGPT

    try {
      const response = await fetch("/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      const chatGptResponse = data.text;

      setMessages([
        ...newMessages,
        { role: "assistant", content: chatGptResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
    setUserInput("");
  };

  return (
    <div>
      <div
        style={{
          minHeight: "300px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>
              {message.role.charAt(0).toUpperCase() + message.role.slice(1)}:
            </strong>{" "}
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type a message..."
          style={{ width: "100%", marginTop: "10px" }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
