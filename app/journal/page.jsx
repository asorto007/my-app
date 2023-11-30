// pages/journal.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const Journal = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "30px",
    fontFamily: "PT Serif",
    fontWeight: "700",
  };

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      setMessages([...messages, { sender: "User", text: trimmedInput }]);
      // Simulate an AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "AI", text: "Put AI here" },
        ]);
      }, 500);
      setInputValue("");
    }
  };

  

  const handleReflectionsButtonClick = () => {
    console.log("This was called");
    console.log('Current messages:', messages);
    // Other logic based on messages if needed
    router.push("/reflections");
  };
  

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "rgba(27, 74, 156, 0.70)",
      }}
    >
      {/* Navigation */}
      <div
        style={{
          position: "absolute",
          top: 15,
          right: 30,
          display: "flex",
          gap: "20px",
        }}
      >
        <button style={buttonStyle} onClick={() => router.push("/")}>
          Home
        </button>
        <button style={buttonStyle} onClick={() => router.push("/journal")}>
          Journal
        </button>
        <button style={buttonStyle} onClick={handleReflectionsButtonClick}>
          Reflections
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
            router.push("/sign-in");
          }}
        >
          Log Out
        </button>
      </div>

      {/* Date and Page Title */}
      <div
        style={{
          width: "642px",
          height: "110px",
          left: "330px",
          top: "62px",
          position: "absolute",
          opacity: "0.85",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "40px",
            fontFamily: "PT Serif",
            fontWeight: "700",
          }}
        >
          {date}
        </span>
      </div>

      {/* Chat Box */}
      <div
        style={{
          width: "600px",
          height: "500px",
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          top: "150px",
          position: "absolute",
          background: "white",
          borderRadius: "10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              color: message.sender === "AI" ? "grey" : "black",
              fontSize: "18px",
              margin: "5px 0",
              alignSelf: message.sender === "AI" ? "flex-start" : "flex-end",
            }}
          >
            <span>{message.text}</span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div
        style={{
          width: "600px",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "30px",
          position: "absolute",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          style={{
            width: "calc(100% - 100px)",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #CCC",
            marginRight: "10px",
          }}
          placeholder="Type Something here"
        />
        <button
          onClick={handleSend}
          style={{
            width: "80px",
            padding: "10px 20px",
            borderRadius: "10px",
            background: "#282E31",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Journal;
