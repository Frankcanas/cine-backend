// app/src/utils/logger.ts

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

export class Logger {
  private format(level: LogLevel, message: string, context?: any): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context !== undefined && { context }),
    };
    return JSON.stringify(entry);
  }

  info(message: string, context?: any): void {
    console.log(this.format("INFO", message, context));
  }

  warn(message: string, context?: any): void {
    console.warn(this.format("WARN", message, context));
  }

  error(message: string, context?: any): void {
    console.error(this.format("ERROR", message, context));
  }

  debug(message: string, context?: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("DEBUG", message, context));
    }
  }
}

export const logger = new Logger();
export default logger;
