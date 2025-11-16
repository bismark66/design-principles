export interface Handler {
  setNext(handler: any): Handler;

  handle(request: any): any;
}
