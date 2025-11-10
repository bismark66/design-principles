import { NotificationFactory } from "../factory";
import { SMSProviderType, Provider } from "../interface";
import { HelioSmsProvider } from "../sms-providers/helio-sms-provider";
import { HubtelSmsProvider } from "../sms-providers/hubtel-sms-provider";

class SmsService extends NotificationFactory {
  private providers: {
    hubtel: HubtelSmsProvider;
    helio: HelioSmsProvider;
  };
  private provider?: SMSProviderType;

  constructor(provider?: SMSProviderType) {
    super();
    this.providers = {
      hubtel: new HubtelSmsProvider(),
      helio: new HelioSmsProvider(),
    };
    this.provider = provider;
  }

  createProvider(): Provider {
    const selectedProvider: SMSProviderType = this.provider || "hubtel";
    const provider = this.providers[selectedProvider];
    return provider;
  }
}

export { SmsService };
