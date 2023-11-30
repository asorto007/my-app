/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import "./signup.css"; // Make sure this CSS file is linked correctly

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

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

  if (loading || user) {
    return <div>Loading...</div>; // or any loading component
  }

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", true);
      // Clear form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      router.push("/sign-in");
      // Redirect or show success message
    } catch (e) {
      console.error(e);
      // Show error message
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img className="logo" src="logo.png" alt="Logo" />
        <div className="tagline">Balance Your Code and Mind</div>
        <div className="description">
          Join GitWell and start personalizing your path to mental wellness.
        </div>
      </div>
      <div className="signup-form-container">
        <h1 className="signup-header">Sign Up</h1>
        <p className="signup-subheader">Please enter your details</p>
        <div className="input-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="signup-input half"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="signup-input half"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input full"
        />
        <input
          type="password"
          placeholder="Re-Enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="signup-input full"
        />
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
