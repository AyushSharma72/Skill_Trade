export async function CompleteRequest(rid, uid, wid, comment, price, stars) {
  try {
    console.log("rid ", rid);
    console.log("wid ", wid);
    console.log("uid ", uid);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request//RequestCompleted/${rid}/${uid}/${wid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, price, stars }),
      }
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
      message: "error try again",
    };
  }
}
