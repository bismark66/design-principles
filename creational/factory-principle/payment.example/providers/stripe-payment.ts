import { PaymentGateway } from "../interface";

export class StripePaymentGateway implements PaymentGateway {
  Pay(): void {
    console.log("Paying via Stripe...");
  }
}
