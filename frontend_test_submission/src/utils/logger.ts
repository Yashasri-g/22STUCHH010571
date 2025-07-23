import { Log } from '../../../Logging Middleware/logger'; 

export const logFrontend = async (
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  pkg: 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils',
  message: string
) => {
  await Log({
    stack: 'frontend',
    level,
    package: pkg,
    message,
  });
};
export {};
