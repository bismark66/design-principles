import { Provider } from "../interface";

class MailChimpEmailProvider implements Provider {
  notify(): void {
    console.log("Sending email via Mailchimp...");
  }
}

export { MailChimpEmailProvider };
