"use client";
import { useEffect, useState ,use} from "react";
import RequestDetails from "./RequestDetails";

export default function RequestDetailsClient({ params}) {
  const { rid }= use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rid) {
      setError("Request ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true); // Ensure loading state is reset when fetching

      try {
        // removed console.log for production


        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`
          // ,{
          //   next:{revalidate:60}
          // }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const info = await response.json();
        // removed console.log for production


        if (info.success) {
          setData(info.requestdetails);
          setError(null);
        } else {
          throw new Error(info.message || "Failed to fetch request details.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rid]); 

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p className="text-red-600 text-center text-2xl">{error}</p>;

  return (
    <RequestDetails
      initialData={data}
      loadingstate={false}
      intialimage={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetRequestPhotoController/${rid}`}
    />
  );
}
