/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import "./signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="signin-container">
      <img src="logo.png" alt="Placeholder" className="placeholder-image" />
      <div className="signin-box">
        <h1 className="signin-title">Welcome</h1>
        <p className="signin-subtitle">Please enter your details</p>
        <div className="signin-form">
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />
          <button onClick={handleSignIn} className="signin-button">
            Log In
          </button>
        </div>
        <div className="signin-footer">
          Don’t have an account?{" "}
          <span
            className="signin-signup"
            onClick={() => router.push("/sign-up")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
