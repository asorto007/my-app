// withAuth.js
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/sign-in");
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>; // or any loading component
    }

    return <Component {...props} />;
  };
};

export default withAuth;
