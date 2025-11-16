import { BaseChain } from "../base-chain";

export class Order extends BaseChain {
  handle(request: any): any {
    if (!request.orderDataValid) {
      return "Order processing failed. Invalid order data.";
    }
    console.log("Processing order:", request);
    return super.handle(request);
  }
}
