export async function ReportRequest(wid, rid, IssueType) {
  try {
    console.log(IssueType);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/report/${wid}/${rid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueType: IssueType }),
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
