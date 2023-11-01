"use client";
import Image from "next/image";
import MainApp from "./components/MainApp.jsx";
import LoginForm from "./components/auth/Login.jsx";
import RegistrationForm from "./components/auth/RegisterUser.jsx";
import { auth } from "./firebase.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // const app = initFirebase();

  // console.log(
  //   app.name ? "Fireb  ase Mode Activated!" : "Firebase not working :("
  // );
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("DashBoard: User is signed in");
        // setUser(user); // Set the user in the component state
        router.push("/dashboard");
      } else {
        router.push("/");
        console.log("DashBoard: User is signed out");
      }
    });

    return () => unsubscribe(); // Clean up the subscription when the component is unmounted
  }, [router]);

  return (
    <main>
      <h1>Hello </h1>
      <MainApp />
      <LoginForm />
      <RegistrationForm />
    </main>
  );
}
