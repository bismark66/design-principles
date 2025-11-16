import { Handler } from "./interface";

export abstract class BaseChain {
  private nexthandler: Handler | null = null;
  //   constructor(handler: any) {
  //     this.handler = handler;
  //   }
  setNext(handler: Handler): Handler {
    this.nexthandler = handler;
    return handler;
  }

  handle(request: any): any {
    if (this.nexthandler) {
      console.log("handled by base", this.constructor.name);
      return this.nexthandler.handle(request);
    }
    return null;
  }
}
