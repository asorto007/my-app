/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import "./signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Anthony added this

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  //from user we need to check email and personal info
  // Client-side only code
  // right now we access their email and info from the user object
  // how can I add authentication to each page?
  useEffect(() => {
    const userSession = sessionStorage.getItem("user");
    if (user && userSession) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // or any loading component
  }

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      const idToken = await res.user.getIdToken();
      if (!idToken) {
        console.log("no id token");
        router.push("/sign-in");
      } else {
        console.log("id token");
        console.log({ res });
        sessionStorage.setItem("user", true);
        setEmail("");
        setPassword("");
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      setError("Invalid email or password"); // Anthony added this
      setEmail("");
      setPassword("");
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
        <div class="hidden-info mt-3">
          <p id="msg-for-failure">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
