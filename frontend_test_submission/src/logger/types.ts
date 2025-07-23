export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogStack = 'backend' | 'frontend';

export type FrontendPackage = 
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

export type BackendPackage = 
  | 'cache'
  | 'controller'
  | 'cron_job'
  | 'db'
  | 'domain'
  | 'handler'
  | 'repository'
  | 'route'
  | 'service'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

export type LogPackage = FrontendPackage | BackendPackage;

export interface LogEntry {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}
