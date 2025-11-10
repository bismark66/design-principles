// payment-gateway.interface.ts
export interface PaymentAdapterGateway {
  charge(amount: number): void;
}
