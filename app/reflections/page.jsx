"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, app, db } from "@/app/firebase/config";
//Anthony made this change
import withAuth from "@/app/components/auth";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjdoF_RhkK2U-XmQYrANmr_G1PBVHlZww",
  authDomain: "gitwell-auth.firebaseapp.com",
  databaseURL: "https://gitwell-auth-default-rtdb.firebaseio.com",
  projectId: "gitwell-auth",
  storageBucket: "gitwell-auth.appspot.com",
  messagingSenderId: "320576997296",
  appId: "1:320576997296:web:0b906d02cbc805375c3875"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Assuming this data could be fetched from a database or state management store
const dummyEntries = [
  {
    date: "2022-09-15",
    quotes: [
      {
        text: "It is impossible for a man to learn what he thinks he already knows.",
        author: "—Epictetus",
      },
      {
        text: "My ego supported by modern technology often makes me believe I've, or can figure things out, fairly easily. But some things like gardening or parenting, do not obey to classic ignorance > knowledge > solution pattern. It needs to be experienced to viscerally be discarded.",
        author: "",
      },
    ],
  },
  {
    date: "2022-09-12",
    quotes: [
      {
        text: "After all these years, I have come to realise that I must go through a period of agony and torture before I have a breakthrough.",
        author: "—Hans Zimmer",
      },
    ],
  },
  // ...more entries
];
                                               
const Reflections = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [entries, setEntries] = useState(dummyEntries); // Replace with your actual data-fetching logic
  const [messages, setMessages] = useState([]);

  const buttonStyle = {
    background: "none",        
    border: "none",
    color: "black",
    cursor: "pointer",
    fontSize: "30px",
    fontFamily: "PT Serif",
    fontWeight: "700",
  };


  const email = user.email;
  console.log(email);
  // my code
  useEffect(() => {
    async function retrieveChats() {
      try {
        console.log("Use effect called");
        const getResponse = await fetch(`/api/retrieveChat`, {
          method: "GET",
          headers: {
            "Content-Type": email,
          }
        });
        // const getResponse = await fetch(`/api/retrieveChat`, {

        // })

        const data = await getResponse.json();
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    }
    retrieveChats();
  }, [email])


  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "white",
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
      {/* Entry Display */}
      <div style={{ padding: "90px" }}>
        {messages.slice() // Create a shallow copy of the array to avoid mutating the original array
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((entry) => (
          <div
            key={entry.date}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {new Date(entry.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {entry.messages.map((message, index) => (
              <blockquote
                key={index}
                style={{ fontStyle: "italic", margin: "10px 0" }}
              >
                {"User: " + message.user}
                <br />
                <span style={{ fontWeight: "bold" }}>{"ChatGPT: " + message.ChatGPT}</span>
              </blockquote>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Reflections);
