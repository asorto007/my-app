"use client";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase"; // Adjust the path accordingly
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const app = initFirebase();

  // console.log(
  //   app.name ? "Firebase Mode Activated!" : "Firebase not working :("
  // );
  // const auth = getAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          console.log("Login: User logged in successfully!");
          const user = userCredential.user;
          router.push("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      // router.push("/dashboard");
      // await auth.signInWithEmailAndPassword(formData.email, formData.password);
      // console.log("User logged in successfully!");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" onClick={() => router.push("/dashboard")}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
