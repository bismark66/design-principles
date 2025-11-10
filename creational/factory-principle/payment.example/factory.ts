import { PaymentGateway, CreatePaymentGatewayFactory } from "./interface";

abstract class PaymentFactory {
  abstract createPaymentGateWay(): Promise<PaymentGateway>;

  async makePayment(): Promise<void> {
    const paymentGateway = await this.createPaymentGateWay();
    return paymentGateway.Pay();
  }
}

export { PaymentFactory };
