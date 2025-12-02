import { LogHandler } from "./logHandler.interface";

export abstract class BaseLogger implements LogHandler {
  private nextHandler: LogHandler | undefined;

  setNext(handler: LogHandler): LogHandler {
    this.nextHandler = handler;
    return handler;
  }

  log(msg: any): any {
    if (this.nextHandler) {
      return this.nextHandler.log(msg);
    }
    return null;
  }
}
