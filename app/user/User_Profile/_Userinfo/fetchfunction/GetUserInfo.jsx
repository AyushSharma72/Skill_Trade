const cache = {};

export async function GetUserInfo(uid) {
  try {
    // Check if the data for the given uid exists in the cache
    if (cache[uid]) {
      return {
        data: cache[uid],
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/Userinfo/${uid}`,
    );

    if (response.status === 200) {
      const data = await response.json();
      cache[uid] = data;

      return {
        data,
      };
    } else {
      return {
        success: false,
        message: "Failed to fetch user info",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error, try again",
    };
  }
}
