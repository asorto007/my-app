// pages/journal.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import withAuth from "@/app/components/auth";
import { auth, app, db } from "@/app/firebase/config";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const Journal = () => {
  const [user] = useAuthState(auth);
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

  const handleSend = async () => {
    try {
      const trimmedInput = inputValue.trim();
      if (trimmedInput) {
        setMessages([...messages, { sender: "User", text: trimmedInput }]);
        const payload = {
          prompt: trimmedInput,
        };
        console.log("payload", payload);
        const response = await fetch("/api/getChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trimmedInput),
        });

        if (response.status != 200) {
          console.log("Error: " + response.status);
          throw new Error("Error: " + response.status);
        }

        const jsonData = await response.json();
        // Simulate an AI response
        // createUserPrompt(inputValue);
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "AI", text: jsonData.text },
          ]);
        }, 500);
        setInputValue("");

        console.log("Got to second post");
        const dataToInsert = {
          user: trimmedInput,
          ChatGPT: jsonData.text,
          email: "skarn5@uic.edu",
          date: date
        }

        const insertPayload = {
          prompt: dataToInsert
        }

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


        /* What I'm thinking */

        // const emailsCollection = collection(db, "/emails");
        // const email = "skarn5@uic.edu";
        // const emailCollection = doc(emailsCollection, email);
        // const days = collection(emailCollection, "/days");
        // const specificDay = doc(days, date);

        // setDoc(emailCollection, {});
        // setDoc(specificDay, {});

        // const newObject = {user: userInput, ChatGPT: chatGptResponse};

        // const specificDaySnapshot = await getDoc(specificDay);

        // if (specificDaySnapshot.exists()) {
        //   const currentEntries = specificDaySnapshot.data()?.entries;
        //   currentEntries.push(newObject);
        //   setDoc(specificDay, {entries: currentEntries});
        // } else {
        //   setDoc(specificDay, {entries: newObject});
        // }

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReflectionsButtonClick = () => {
    console.log("This was called");
    console.log("Current messages:", messages);
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
        <button style={buttonStyle} onClick={() => router.push("/reflections")}>
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

export default withAuth(Journal);
