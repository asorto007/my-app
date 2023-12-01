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
  const [userFeeling, setUserFeeling] = useState(""); // State to hold the user's feeling

  const saveFeelingToFirestore = async (feeling) => {
    try {
      // Manually specify a Document ID
      const docId = "JvB7brbRjHe1oWctHBzV"; // Replace this with your logic to generate or define an ID

      // Define the document reference with a specific ID
      const docRef = doc(db, "feelings", docId);

      // Set the document data
      await setDoc(docRef, {
        userId: user.email,
        feeling: feeling,
      });

      console.log("Feeling saved successfully with custom ID.");
    } catch (error) {
      console.error("Error saving feeling to Firestore:", error);
    }
  };

  const handleFeelingSelection = (feeling) => {
    setUserFeeling(feeling);
    saveFeelingToFirestore(feeling); // Save the feeling when it's selected
  };

  const feelings = [
    { name: "happy", emoji: "😊" },
    { name: "neutral", emoji: "😐" },
    { name: "sad", emoji: "😔" },
    // ... add more feelings as necessary ...
  ];

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
          timeout: 5000,
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
        console.log(user.email);
        const dataToInsert = {
          user: trimmedInput,
          ChatGPT: jsonData.text,
          email: user.email,
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

  const textStyle = {
    paddingLeft: "48px", // Adjust padding as needed
    // Other styling properties can go here
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
      <div
        style={{
          width: "300px",
          height: "200px",
          paddingTop: "40px",
          paddingLeft: "20px",
          paddingRight: "20px",
          left: "78%",
          transform: "translateX(-35%)",
          top: "290px",
          position: "absolute",
          background: "white",
          borderRadius: "10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontFamily: "PT Serif",
        }}
      >
        <div style={textStyle}>How are you feeling today?</div>
        {feelings.map((feeling) => (
          <button
            key={feeling.name}
            onClick={() => handleFeelingSelection(feeling.name)}
            style={{
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
              border: "none",
            }}
          >
            {feeling.emoji}
          </button>
        ))}
      </div>
      <div
        style={{
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "100px",
        }}
      ></div>

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
          width: "643px",
          height: "110px",
          left: "400px",
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
          left: "34%",
          transform: "translateX(-35%)",
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
            <span>
              {message.sender === "AI" && (
                <span>
                  <strong>SyntaxSolace:</strong> {message.text}
                </span>
              )}
              {message.sender !== "AI" && <span>{message.text}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div
        style={{
          width: "600px",
          left: "34%",
          transform: "translateX(-34%)",
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
            width: "calc(100% - 70px)",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #CCC",
            marginRight: "10px",
          }}
          placeholder="type your thoughts/feelings here"
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
