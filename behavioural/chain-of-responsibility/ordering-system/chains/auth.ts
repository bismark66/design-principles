import { BaseChain } from "../base-chain";

export class Auth extends BaseChain {
  handle(request: any): any {
    console.log("---");
    if (request.isAuthenticated) {
      console.log("finished authentication");
      return super.handle(request);
    }
    console.log("failed in auth");
    return "Authentication failed. Access denied.";
  }
}
