import { Provider } from "../interface";

class MailgunEmailProvider implements Provider {
  notify(): void {
    console.log("Sending email via Mailgun...");
  }
}

export { MailgunEmailProvider };
