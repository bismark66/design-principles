import { PaymentFactory } from "../factory";
import { PaymentGateway } from "../interface";
import { MtnMomoPaymentGateway } from "../providers/mtn-momo.payment";

export class MtnMomoPayment extends PaymentFactory {
  async createPaymentGateWay(): Promise<PaymentGateway> {
    return new MtnMomoPaymentGateway();
  }
}
