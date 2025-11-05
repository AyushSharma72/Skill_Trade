export async function UnAssign(rid, wid, reason) {
  try {
    const currentdate = new Date();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/Unassignrequest/${rid}/${wid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason,
          date: currentdate,
        }),
      }  
    );
    if (response) {
      return response;
    }
  } catch (error) {
    return {
      success: false,
      message: "Error try again",
    };
  }
}
