import { BaseLogger } from "../base-logger";

export class DebugLogger extends BaseLogger {
  log(msg: any): any {
    console.debug("Debug Logger: " + msg);
    if (msg.isDebug) {
      return super.log(msg);
    }
    return; // Stop further logging for debug messages
  }
}
