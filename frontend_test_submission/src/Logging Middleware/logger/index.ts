export type Stack = 'frontend' | 'backend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package =
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler'
  | 'repository' | 'route' | 'service' | 'api' | 'component' | 'hook'
  | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';

interface LogParams {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export const Log = async ({ stack, level, package: pkg, message }: LogParams): Promise<void> => {
  const endpoint = 'http://20.244.56.144/evaluation-service/logs';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    const data = await response.json();
    console.log('Log created:', data.message, '| Log ID:', data.logID);
  } catch (err) {
    console.error('Logging failed:', err);
  }
};