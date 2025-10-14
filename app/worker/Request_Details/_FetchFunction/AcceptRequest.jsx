export async function AcceptRequestFetchFunction(
  wid,
  rid,
  EstimatedPrice,
  description,
  date
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/AcceptRequest/${wid}/${rid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EstimatedPrice,
          description,
          date,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      message: "Error try again",
    };
  }
}
