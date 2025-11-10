import { Transport } from "./product.interface";

class Ship extends Transport {
  async deliver() {
    console.log("Deliver by Ship");
  }
}
export default Ship;
