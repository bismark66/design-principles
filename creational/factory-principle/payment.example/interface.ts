interface PaymentGateway {
  Pay(): void;
}

interface CreatePaymentGatewayFactory {
  createPayment(): Promise<PaymentGateway>;
}

export { PaymentGateway, CreatePaymentGatewayFactory };
