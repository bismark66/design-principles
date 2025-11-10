import { Provider } from "../interface";

class HubtelSmsProvider implements Provider {
  notify(): void {
    console.log("Sending SMS via Hubtel...");
  }
}

export { HubtelSmsProvider };
