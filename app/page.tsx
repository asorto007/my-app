/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import React, { useEffect } from "react";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Client-side only code
  useEffect(() => {
    const userSession = sessionStorage.getItem("user");

    if (!user && !userSession) {
      router.push("/sign-in");
    }
  }, [user, router]);

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "black",
    cursor: "pointer",
    fontSize: "30px",
    fontFamily: "PT Serif",
    fontWeight: "700",
    zIndex: 1,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
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

      {/* Welcome Text */}
      <div style={{ position: "absolute", top: 439, left: 58 }}>
        <span
          style={{
            color: "black",
            fontSize: "90px",
            fontFamily: "PT Serif",
            fontWeight: "700",
          }}
        >
          Welcome!
        </span>
        <br />
        <span
          style={{
            color: "black",
            fontSize: "55px",
            fontFamily: "PT Serif",
            fontStyle: "italic",
            fontWeight: "400",
          }}
        >
          What’s on your mind?
        </span>
      </div>

      {/* Start Journaling Button */}
      <div
        style={{
          position: "absolute",
          top: 691,
          left: 66,
          width: "277px",
          height: "90px",
          background: "#282E31",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "30px",
            fontFamily: "PT Serif",
            fontWeight: "700",
          }}
          onClick={() => router.push("/journal")}
        >
          Start Journaling
        </span>
      </div>

      {/* Placeholder for Icons */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 58,
          width: "87px",
          height: "66px",
          background: "#EFECEC",
          borderRadius: "40px",
          border: "1px solid #FFF5EE",
        }}
      ></div>
      <img
        src="ok.png"
        alt="Notebook"
        style={{
          position: "absolute",
          top: 330,
          left: 74,
          width: "53px",
          height: "53px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 161,
          width: "87px",
          height: "66px",
          background: "#EFECEC",
          borderRadius: "40px",
          border: "1px solid #FFF5EE",
        }}
      ></div>
      <img
        src="conversation.png"
        alt="Notebook"
        style={{
          position: "absolute",
          top: 330,
          left: 176,
          width: "55px",
          height: "56px",
        }}
      />

      {/* Placeholder for Notebook Image */}
      <img
        src="journal.png"
        alt="Notebook"
        style={{
          position: "absolute",
          top: "-35px",
          left: "984px",
          width: "900px",
          height: "1110px",
        }}
      />
    </div>
  );
}
