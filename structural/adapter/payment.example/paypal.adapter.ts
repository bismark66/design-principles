import { PaymentAdapterGateway } from "./interface";
import { LegacyPayPal } from "./legacy-paypal";

export class PaypalAdaptor implements PaymentAdapterGateway {
  private legacyPaypal: LegacyPayPal;

  constructor(legacyPaypal: LegacyPayPal) {
    this.legacyPaypal = legacyPaypal;
  }

  charge(amount: number): void {
    const payment = this.legacyPaypal.makePayment(amount);

    return payment;
    // console.log(`Charging ${amount} using Paypal new adapter...`);
  }
}
