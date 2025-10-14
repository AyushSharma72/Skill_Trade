export async function GetRequestFilteredData(
  ServiceType,
  checkedValues,
  distance,
  wid,
  WorkerCoordinates
) {
  try {
    let queryParams = new URLSearchParams(checkedValues).toString();

    queryParams += `&ServiceType=${ServiceType}`;
    queryParams += `&maxDistance=${distance}`;
    queryParams += `&lat=${WorkerCoordinates.latitude}`;
    queryParams += `&lon=${WorkerCoordinates.longitude}`;

    // Construct the final URL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/Filterrequest/${wid}?${queryParams}`
    );

    const info = await response.json();
    if (response.ok) {
      return info;
    } else {
      return info;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error, try again",
    };
  }
}
