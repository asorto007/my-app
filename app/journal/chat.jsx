// app/chat.tsx -- client component
"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";

export default function MyComponent({ email }) {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    append,
    isLoading,
    handleSubmit,
  } = useChat({
    api: "/api/chat",
  });

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function getChats() {
      try {
        if (isSubmitted && messages.length > 0) {
          const aiResponse = messages[messages.length - 1]?.content || "";

          console.log("AI Response:", aiResponse);
          // Prepare the data for the insertChat API
          const dataToInsert = {
            user: input,
            ChatGPT: aiResponse,
            email: "asorto3@uic.edu",
            date: date,
          };

          const insertPayload = {
            prompt: dataToInsert,
          };

          const postRequest = await fetch(`/api/insertChat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify(insertPayload),
          });

          if (postRequest.status === 200) {
            console.log("HOORAY!");
          }
          console.log("Before setInput");
          console.log("After setInput, input value:", input);

          setIsSubmitted(false);
        }
      } catch (error) {
        console.error("Error in form submission:", error);
      }
    }
    getChats();
  }, [messages, isSubmitted]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim() || isLoading) {
      // Prevent submitting empty messages or while loading
      return;
    }

    try {
      const userInput = input.trim();
      setInput("");
      await append({ role: "user", content: userInput });
      setIsSubmitted(true);

      // Prepare the data for the insertChat API
      // console.log(aiResponse);
      // const dataToInsert = {
      //   user: userInput,
      //   ChatGPT: aiResponse,
      //   email: "asorto3@uic.edu", // Make sure 'user' is defined and has 'email'
      //   date: date,
      // };

      // const insertPayload = {
      //   prompt: dataToInsert,
      // };

      // // Send the data to your API
      // const postRequest = await fetch(`/api/insertChat`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "same-origin",
      //   body: JSON.stringify(insertPayload),
      // });

      // if (postRequest.status === 200) {
      //   console.log("HOORAY!");
      // }
      // console.log("Before setInput");
      // console.log("After setInput, input value:", input);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div>
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
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              color: m.role === "assistant" ? "grey" : "black",
              fontSize: "18px",
              margin: "5px 0",
              alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
            }}
          >
            <span>
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <form
        style={{
          width: "600px",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "30px",
          position: "absolute",
        }}
        onSubmit={handleFormSubmit}
      >
        <input
          value={input}
          onChange={handleInputChange}
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
          type="submit"
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
      </form>
    </div>
  );
}
