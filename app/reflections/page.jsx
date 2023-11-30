"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
//Anthony made this change
import withAuth from "@/app/components/auth";

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

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "black",
    cursor: "pointer",
    fontSize: "30px",
    fontFamily: "PT Serif",
    fontWeight: "700",
  };

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
        {entries.map((entry) => (
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
            {entry.quotes.map((quote, index) => (
              <blockquote
                key={index}
                style={{ fontStyle: "italic", margin: "10px 0" }}
              >
                {quote.text}
                <br />
                <span style={{ fontWeight: "bold" }}>{quote.author}</span>
              </blockquote>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Reflections);
