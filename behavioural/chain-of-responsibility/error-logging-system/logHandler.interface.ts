export interface LogHandler {
  setNext(handler: LogHandler): LogHandler;

  log(msg: any): any;
}
