"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/UserAuthContent";
import PulseLoader from "react-spinners/PulseLoader";

export default function UserPrivateRoutes(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Load authentication from localStorage on client-side
    useEffect(() => {
      if (!auth?.token) {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
      }
    }, [auth, setAuth]);

    useEffect(() => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

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

          const data = await res.json();
          setIsAuthenticated(res.ok && data.success);
        } catch (error) {
          console.error("Error checking authentication:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [auth?.token]);

    // Redirect user if not authenticated
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/");
      }
    }, [loading, isAuthenticated, router]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="flex justify-center w-full h-screen items-center gap-4">
          <p className="font-bold text-3xl">Checking Authentication</p>
          <PulseLoader />
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
}
