// src/services/logService.ts
const BACKEND_URL = "http://20.244.56.144/evaluation-service/logs";
const accessToken = "Bearer YOUR_ACCESS_TOKEN_HERE";

type Stack = "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export async function log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    return await response.json();
  } catch (err) {
    console.warn("Log failed", err);
  }
}
