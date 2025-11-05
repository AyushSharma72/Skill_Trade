"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/UserAuthContent";
import PulseLoader from "react-spinners/PulseLoader";

export default function CheckLogin(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/userAuth`,
            {
              headers: {
                authorization: auth?.token,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
        } finally {
          setLoading(false);
        }
      };

      if (typeof window !== "undefined") {
        // Ensure it's running on the client
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth && auth?.token) {
          checkAuth();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    }, [auth?.token, router]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="flex justify-center w-full h-screen items-center gap-4">
          <p className="font-bold text-3xl">Checking Authentication</p>
          <PulseLoader />
        </div>
      );
    }

    if (isAuthenticated) {
      router.push("/");
      return (
        <div className="flex justify-center w-full h-screen items-center">
          <p className="font-bold text-3xl">Redirecting...</p>
        </div>
      );
    } else {
      return <WrappedComponent {...props} />;
    }
  };
}
