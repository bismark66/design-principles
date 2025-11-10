import { Provider } from "../interface";

class PostmarkEmailProvider implements Provider {
  notify(): void {
    console.log("Sending email via Postmark...");
  }
}

export { PostmarkEmailProvider };
