export default async function UpdateRequest(date, time, address, pincode, rid) {
  try {
    const formData = new FormData();
    formData.append("date", date);
    formData.append("time", time);
    formData.append("address", address);
    formData.append("pincode", pincode);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/EditRequest/${rid}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      message: "please try again",
    };
  }
}
