export async function DeleteRequestFetchFunction(rid) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/DeleteRequest/${rid}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return {
      success: false,
      message: "error try again",
    };
  }
}
