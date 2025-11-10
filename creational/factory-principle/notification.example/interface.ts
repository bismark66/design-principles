export interface Provider {
  notify(): void;
}

export type EmailProviderType = "postmark" | "mailgun" | "mailchimp";
export type SMSProviderType = "hubtel" | "helio";
