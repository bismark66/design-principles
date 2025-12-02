import { BaseLogger } from "../base-logger";

export class InfoLogger extends BaseLogger {
  log(msg: any): any {
    console.log(`INFO: ${msg}`);
    if (msg.isInfoOnly) {
      return super.log(msg);
    }
    return; // Stop further logging for info-only messages
  }
}
