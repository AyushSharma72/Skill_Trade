export async function UpdatePassword(uid, passwords) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/UserPassword/${uid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwords }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating password",
    };
  }
}
