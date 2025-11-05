import RequestDetailsClient from "./RequestDetailsClient";

async function fetchRequestDetails(rid) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`
      // {
      //   next: { revalidate: 100 }, // ISR: Revalidate every 100 seconds
      // }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch request data: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching request details:", error);
    return null;
  }
}

export default async function RequestDetailsServer({ params }) {
  const { rid } = await params;
  const data = await fetchRequestDetails(rid); // Fetch data before rendering

  if (!data) {
    return (
      <div className="text-red-500 text-xl text-center mt-4">
        Error: Unable to fetch data. Please try again later.
      </div>
    );
  }

  return (
    <RequestDetailsClient
      IntialRequestData={data.requestdetails}
      loadingstate={false}
      requestimage={`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetRequestPhotoController/${rid}`}
    />
  );
}
