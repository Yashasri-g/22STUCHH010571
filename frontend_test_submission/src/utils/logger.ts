

export const logToBackend = async (logType: string, logData: any) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        level: logType,
        message: logData.message || "",
        timestamp: new Date().toISOString(),
        additionalInfo: logData.additionalInfo || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send log to backend", errorText);
    }
  } catch (error) {
    console.error("Error logging to backend:", error);
  }
};
