import type { Provider } from "./interface.ts";

interface createProvider {
  createProvider(): Promise<Provider>;
}

abstract class NotificationFactory {
  abstract createProvider(): Provider;

  async sendEmail(): Promise<void> {
    const provider = this.createProvider();
    return provider.notify();
  }

  async sendSMS(): Promise<void> {
    const provider = this.createProvider();
    return provider.notify();
  }

  async sendPushNotification(): Promise<void> {
    const provider = this.createProvider();
    return provider.notify();
  }
}

export { createProvider, NotificationFactory };
