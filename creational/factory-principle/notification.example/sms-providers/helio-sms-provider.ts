import { Provider } from "../interface";
class HelioSmsProvider implements Provider {
  notify(): void {
    console.log("Sending SMS via Helio...");
  }
}

export { HelioSmsProvider };
