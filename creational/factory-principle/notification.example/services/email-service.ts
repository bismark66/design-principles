import { MailChimpEmailProvider } from "../email-providers/mailchimp-email-provider";
import { MailgunEmailProvider } from "../email-providers/mailgun-email-provider";
import { PostmarkEmailProvider } from "../email-providers/postmark-email-provider";
import { NotificationFactory } from "../factory";
import { Provider, EmailProviderType } from "../interface";

class EmailService extends NotificationFactory {
  providers: {
    postmark: PostmarkEmailProvider;
    mailgun: MailgunEmailProvider;
    mailchimp: MailChimpEmailProvider;
  };
  provider?: EmailProviderType;

  constructor(provider?: EmailProviderType) {
    super();
    this.providers = {
      postmark: new PostmarkEmailProvider(),
      mailgun: new MailgunEmailProvider(),
      mailchimp: new MailChimpEmailProvider(),
    };
    this.provider = provider;
  }

  createProvider(): Provider {
    const selectedProvider: EmailProviderType = this.provider || "postmark";
    return this.providers[selectedProvider];
  }
}

export { EmailService };
