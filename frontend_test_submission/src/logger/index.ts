import { LogEntry, LogResponse } from './types';

const BACKEND_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJneWFzaGFzcmkyMkBpZmhlaW5kaWEub3JnIiwiZXhwIjoxNzUzMjUxNjQ3LCJpYXQiOjE3NTMyNTA3NDcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyNjQ2NWE2ZC1jOTBhLTQ4ZDMtYWExNi1lOWE2Yzk1NmVmMDYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ5YXNoYXNyaSIsInN1YiI6IjdlNDU0ZjQ5LWY0MGUtNDk1Mi04ZDE3LWQyZWUzOTNiZDdmOCJ9LCJlbWFpbCI6Imd5YXNoYXNyaTIyQGlmaGVpbmRpYS5vcmciLCJuYW1lIjoieWFzaGFzcmkiLCJyb2xsTm8iOiIyMnN0dWNoaDAxMDU3MSIsImFjY2Vzc0NvZGUiOiJiQ3VDRlQiLCJjbGllbnRJRCI6IjdlNDU0ZjQ5LWY0MGUtNDk1Mi04ZDE3LWQyZWUzOTNiZDdmOCIsImNsaWVudFNlY3JldCI6ImdUcXh5a01qd1N0eHBudE0ifQ.4grXTr5oZZPPA-xq6d3QgzpbSXPSRJnOrIrRAlLwtrY";

export const Log = async (logEntry: LogEntry): Promise<LogResponse | null> => {
  try {
    // Log to console for development purposes
    console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.stack}/${logEntry.package} - ${logEntry.message}`);
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack: logEntry.stack,
        level: logEntry.level,
        package: logEntry.package,
        message: logEntry.message
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LogResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Logging failed:', error);
    // Fallback to console logging if API fails
    console.log(`[FALLBACK] [${logEntry.level.toUpperCase()}] ${logEntry.stack}/${logEntry.package} - ${logEntry.message}`);
    return null;
  }
};
