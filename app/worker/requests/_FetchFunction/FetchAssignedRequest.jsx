export async function FetchAssignedRequest(wid, pageNumber = 1) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/GetWorkerAssignedRequest/${wid}?pagenumber=${pageNumber}`
    );
    if (response) {
      const data = await response.json();
      return data;
    } else {
      return {
        success: false,
        message: "No response from server",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error try again",
    };
  }
}
