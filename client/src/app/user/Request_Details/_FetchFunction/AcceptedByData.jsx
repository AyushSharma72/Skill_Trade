export async function GetAcceptedByData(rid, pageNumber) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetWhoAcceptedRequest/${rid}/${pageNumber}`
    );
    if (response) {
      const data = await response.json();
      return data;
    } else {
      return {
        message: "error try again later",
      };
    }
  } catch (error) {
    return {
      message: "error try again later",
    };
  }
}
