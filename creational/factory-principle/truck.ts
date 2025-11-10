import { Transport } from "./product.interface";

class Truck extends Transport{
    deliver() {
        console.log("Deliver by Truck");
    }
}
export default Truck;