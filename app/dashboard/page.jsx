"use client";
import React from "react";
import ChatComponent from "../components/ChatComponent.jsx";
import LogOut from "../components/auth/Logout.jsx";
import OpenAI from "openai";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebase.js"; // Adjust the path accordingly
import { useEffect, useState } from "react";

const SubmissionForm = () => {
  const [userAuth, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("DashBoard: User is signed in");
        setUser(user); // Set the user in the component state
      } else {
        router.push("/");
        console.log("DashBoard: User is signed out");
      }
    });

    return () => unsubscribe(); // Clean up the subscription when the component is unmounted
  }, []); // Empty dependency array ensures this effect runs only on mount

  if (userAuth === null) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <main>
      <ChatComponent />
      <LogOut />
    </main>
  );
};

export default SubmissionForm;
