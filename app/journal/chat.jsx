// app/chat.tsx -- client component
"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";

export default function MyComponent({ email }) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    append,
    isLoading,
    handleSubmit,
  } = useChat({
    api: "/api/chat",
  });

  const [dayMesssages, setDayMessages] = useState([]);
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
          const userInput = messages[messages.length - 2]?.content || "";
          const aiResponse = messages[messages.length - 1]?.content || "";

          console.log("User Input:", userInput);
          console.log("AI Response:", aiResponse);
          console.log("Email:", email);
          console.log("Date:", date);
          // Prepare the data for the insertChat API
          const dataToInsert = {
            user: userInput,
            ChatGPT: aiResponse,
            email: email,
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
  }, [messages, isSubmitted, email]);

  // useEffect(() => {
  //   async function retrieveChats() {
  //     try {
  //       console.log("Fetching chats for the day");
  //       const getResponse = await fetch(`/api/retrieveChat`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": email,
  //         },
  //       });
  //       if (getResponse.ok) {
  //         const data = await getResponse.json();
  //         console.log("Retrieved data:", data);
  //         const todaysMessages = data.filter((item) => item.date === date);
  //         const todaysMessagesContent = todaysMessages.flatMap((entry) =>
  //           entry.messages.map((message) => ({
  //             userMessage: message.user,
  //             chatGPTMessage: message.ChatGPT,
  //           }))
  //         );
  //         console.log("Retrieved data:", todaysMessagesContent);
  //         setDayMessages(todaysMessagesContent);
  //         setMessages(todaysMessagesContent); // Update the state with the retrieved messages
  //       } else {
  //         throw new Error(`HTTP error! status: ${getResponse.status}`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching chats:", error);
  //     }
  //   }
  //   if (email) {
  //     retrieveChats(); // Call the function if email is available
  //   }
  // }, [email]);

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
