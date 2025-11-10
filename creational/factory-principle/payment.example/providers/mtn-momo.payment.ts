import { PaymentGateway } from "../interface";

export class MtnMomoPaymentGateway implements PaymentGateway {
  Pay(): void {
    console.log("Paying via MTN MoMo...");
  }
}
