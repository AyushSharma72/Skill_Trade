export default async function GetRequestData(rid) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`
    );

    if (response) {
      const info = await response.json();
      return info;
    }
  } catch (error) {
    return {
      success: false,
      message: "Error: Unable to fetch data. Please try again later.",
    };
  }
}
