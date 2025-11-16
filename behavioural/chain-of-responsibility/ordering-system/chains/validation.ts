import { BaseChain } from "../base-chain";

export class Validate extends BaseChain {
  handle(request: any): any {
    if (request.isValid) {
      console.log("finished validation");
      return super.handle(request);
    }
    return "Validation failed. Invalid data provided.";
  }
}
