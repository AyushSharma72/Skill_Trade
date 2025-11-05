import TimeLine from "./TimeLine";

async function GetData(rid) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/GetSingleUserRequest/${rid}`,
      { next: { revalidate: 100 } }
    );
    const info = await response.json();
    if (info.success) {
      return info.requestdetails;
    }
    throw new Error("Failed to fetch request details.");
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export default async function TimeLineServer({ rid }) {
  const data = await GetData(rid);
  return (
    <>{data ? <TimeLine intialData={data} loadingstate={false} /> : null}</>
  );
}
