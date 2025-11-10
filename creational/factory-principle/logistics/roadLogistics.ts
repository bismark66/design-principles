import { TransportFactory, Transport, Logististics } from "../factory.ts";
import Truck from "../Truck.ts";

export class RoadLogistics extends Logististics {
  async createTransport(): Promise<Transport> {
    return new Truck();
  }
}
