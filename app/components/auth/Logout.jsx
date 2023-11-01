"use client";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase"; // Adjust the path accordingly

const Logout = () => {
  const auth = getAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the home page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
