type options = {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
};

type action<T> = (...args: any[]) => Promise<T>;

class CircuitBreakerPattern<T> {
  action: action<T>;
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  successCount: number;
  nextAttempt: number;

  constructor(action: action<T>, options: options = {}) {
    this.action = action;
    this.failureThreshold = options.failureThreshold ?? 3;
    this.successThreshold = options.successThreshold ?? 2;
    this.timeout = options.timeout ?? 5000;
    this.state = "CLOSED";

    // state variables
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }

  async act(...args: any[]): Promise<any> {
    // Implementation needed
    try {

        if (this.state === "OPEN") {
            // if (Date.now() > this.nextAttempt) {
            //     this.state = "HALF_OPEN";
            // }
            return Promise.reject("Circuit is OPEN. Request blocked!");
        }

        const result = await this.action(...args);
        this.successCount++;
        
        console.log("success count", this.successCount);


        return result;
    } catch (err) {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = "OPEN";
            this.nextAttempt = Date.now() + this.timeout;

    }
  }
// }

function testCircuitBreakerFunction(): Promise<string> {
  const number = Math.random();
  if (number < 0.8) {
    throw new Error("Service failed");
  }
  return Promise.resolve("success");
}

const test = new CircuitBreakerPattern(testCircuitBreakerFunction, {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 5000,
});
// const test = new CircuitBreakerPattern(someAction, options)
