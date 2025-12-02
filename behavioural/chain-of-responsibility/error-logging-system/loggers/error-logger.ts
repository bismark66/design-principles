import { BaseLogger } from "../base-logger";

export class ErrorLogger extends BaseLogger {
  log(msg: any): any {
    console.error("Error Logger: " + msg);
    if (msg.isCritical) {
      // Simulate sending an alert for critical errors
      console.error("ALERT! Critical error occurred: " + msg);
      return super.log(msg);
    }
    return; // Stop further logging for critical errors
  }
}
