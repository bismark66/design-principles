import { Logististics, Transport, TransportFactory } from "../factory";
import Ship from "../ship";

export class SeaLogistics extends Logististics {
  async createTransport(): Promise<Transport> {
    return new Ship();
  }
}
