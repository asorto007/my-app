"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, app, db } from "@/app/firebase/config";
//Anthony made this change
import withAuth from "@/app/components/auth";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
//import "./reflection.css";

// import { initializeApp } from "firebase/app";
import {
  query,
  where,
  getDocs,
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
  appId: "1:320576997296:web:0b906d02cbc805375c3875",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const Reflections = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  //const [entries, setEntries] = useState(dummyEntries); // Replace with your actual data-fetching logic
  const [messages, setMessages] = useState([]);
  // filtering option
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [weekRange, setWeekRange] = useState(""); // New state for the week range
  const [userMood, setUserMood] = useState("");

  const [reflection, setReflection] = useState("");

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  };

  const displayWeekRange = () => {
    // Check if start and end are valid dates before formatting
    if (weekRange.start && weekRange.end) {
      return `${weekRange.start.toLocaleDateString(
        "en-US"
      )} - ${weekRange.end.toLocaleDateString("en-US")}`;
    }
    return "Loading..."; // Or any other placeholder text
  };

  const isInSelectedWeek = (date) => {
    const { start, end } = getWeekRange(selectedWeek);
    return new Date(date) >= start && new Date(date) <= end;
  };

  const FilterbuttonStyle = {
    width: "166px",
    height: "46px",
    background: "none",
    marginRight: "10px",
    fontSize: "17px",
    marginBottom: "-115px",
    margin: "10px",
    cursor: "pointer",
    borderRadius: "40px",
    border: "none",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "black",
    cursor: "pointer",
    fontSize: "30px",
    fontFamily: "PT Serif",
    fontWeight: "700",
  };

  const weekRangeStyle = {
    color: "rgba(27, 74, 156, 0.70)", // Example: Set text color to blue
    fontSize: "40px", // Example: Set font size to 20px
    marginTop: "80px",
    marginBottom: "-5px",
    fontWeight: "700",
    fontFamily: "PT Serif",
  };

  const arrowStyle = {
    fontSize: "24px", // Increase the size of the arrow
    marginRight: "5px", // Optional: Add some space between the arrow and the text
  };

  const email = user.email;
  console.log(email);

  // my code
  useEffect(() => {
    setWeekRange(getWeekRange(selectedWeek)); // Update week range whenever selectedWeek changes

    async function retrieveChats() {
      try {
        console.log("Use effect called");
        const getResponse = await fetch(`/api/retrieveChat`, {
          method: "GET",
          headers: {
            "Content-Type": email,
          },
        });

        const data = await getResponse.json();
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    }
    retrieveChats();
  }, [selectedWeek, email]);

  useEffect(() => {
    const fetchUserMood = async () => {
      try {
        const docRef = doc(db, "feelings", "JvB7brbRjHe1oWctHBzV");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserMood(userData.feeling);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user mood:", error);
      }
    };

    fetchUserMood();
  }, [db]); // Removed unnecessary dependencies

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "white",
      }}
    >
      <div style={{ padding: "10px" }}>
        <div style={weekRangeStyle}>Week: {displayWeekRange()}</div>
        {/* Display formatted week range */}
        <button
          style={FilterbuttonStyle}
          onClick={() =>
            setSelectedWeek(
              new Date(selectedWeek.setDate(selectedWeek.getDate() - 7))
            )
          }
        >
          <span style={arrowStyle}>←</span> Previous Week
        </button>
        <button
          style={FilterbuttonStyle}
          onClick={() => setSelectedWeek(new Date())}
        >
          Current Week
        </button>
        <button
          style={FilterbuttonStyle}
          onClick={() =>
            setSelectedWeek(
              new Date(selectedWeek.setDate(selectedWeek.getDate() + 7))
            )
          }
        >
          Next Week <span style={arrowStyle}>→</span>
        </button>
      </div>

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
      <div style={{ padding: "20px" }}>
        {messages
          .filter((entry) => isInSelectedWeek(entry.date)) // Filter messages for the selected week
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort the filtered messages
          .map((entry) => (
            <div
              key={entry.date}
              style={{
                marginBottom: "20px",
                background: "#FFF9EE",
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
                  <span style={{ fontWeight: "bold" }}>
                    {"SyntaxSolace: " + message.ChatGPT}
                  </span>
                </blockquote>
              ))}
              <div
                style={{
                  fontFamily: "PT Serif",
                  margin: "10px 0",
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "rgb(205, 127, 50)",
                }}
              >
                your mood on this day: {userMood}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default withAuth(Reflections);
