"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const isAdmin = (WrappedComponent) => {
  return function RoleProtectedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          try {
            const auth = JSON.parse(storedAuth);
            if (auth?.user?.role === 2) {
              setIsAdmin(true);
            } else {
              toast.error("Access Denied");
              setTimeout(() => router.replace("/"), 1000);
            }
          } catch (error) {
            toast.error("Invalid authentication data");
            setTimeout(() => router.replace("/"), 1000);
          }
        } else {
          toast.error("Please login");
          setTimeout(() => router.replace("/"), 1000);
        }
        setLoading(false);
      }
    }, []);

    if (loading) {
      return (
        <div className="h-screen flex justify-center items-center text-2xl font-bold">
          Checking Authentication...
        </div>
      );
    }

    if (isAdmin) {
      return <WrappedComponent {...props} role={2} />;
    }

    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-600 text-xl">
          You are not authorized to access this page
        </p>
        <p className="text-xl">Redirecting....</p>
      </div>
    );
  };
};

export default isAdmin;
