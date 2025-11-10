import { CreatePaymentGatewayFactory, PaymentGateway } from "../interface";
import { StripePaymentGateway } from "../providers/stripe-payment";
import { PaymentFactory } from "../factory";

export class StripePayment extends PaymentFactory {
  async createPaymentGateWay(): Promise<PaymentGateway> {
    return new StripePaymentGateway();
  }
}
