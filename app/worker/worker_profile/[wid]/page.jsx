import React from "react";
import WorkerProfileClient from "../WorkerProfileClient";

async function fetchWorkerData(wid) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerData/${wid}`
      // {
      //   next: { revalidate: 60 }, // ISR for revalidating data
      // }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch worker data: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching worker data:", error);
    return null; // Return null on failure
  }
}

export default async function WorkerProfile({ params }) {
  const { wid } = await params;
  const data = await fetchWorkerData(wid); // Fetch data

  if (!data) {
    return (
      <div className="flex flex-col items-center bg-gray-200">
        <p className="text-red-500">
          Failed to load worker data. Please try again later.
        </p>
      </div>
    );
  }

  return <WorkerProfileClient IntialWorkerData={data.worker} />;
}
