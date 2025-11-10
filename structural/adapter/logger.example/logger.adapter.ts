import { ILoggerAdapter } from "./interface";
import { LegacyLogger } from "./legacy-logger";

export class LoggerAdapter implements ILoggerAdapter {
  private legacyLogger: LegacyLogger;

  constructor(legacyLogger: LegacyLogger) {
    this.legacyLogger = legacyLogger;
  }

  log(msg: string): void {
    this.legacyLogger.writeLog(msg);
  }
}
