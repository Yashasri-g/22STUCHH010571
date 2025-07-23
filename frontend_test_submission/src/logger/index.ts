// Shared log types
export type Stack = 'frontend' | 'backend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package =
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

interface LogParams {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export const Log = async ({
  stack,
  level,
  package: pkg,
  message,
}: LogParams): Promise<void> => {
  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    const data = await response.json();
    console.log('Log created:', data.message, 'ID:', data.logID);
  } catch (err) {
    console.error('Logging failed:', err);
  }
};
