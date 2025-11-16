type Action<T> = (...args: any[]) => Promise<T>;

interface CircuitBreakerOptions {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number; // milliseconds
}

class CircuitBreaker<T = any> {
  private action: Action<T>;
  private failureThreshold: number;
  private successThreshold: number;
  private timeout: number;

  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();

  constructor(action: Action<T>, options: CircuitBreakerOptions = {}) {
    this.action = action;
    this.failureThreshold = options.failureThreshold ?? 3;
    this.successThreshold = options.successThreshold ?? 2;
    this.timeout = options.timeout ?? 5000;
  }

  async fire(...args: any[]): Promise<T> {
    console.log("this is the action", this.action);
    console.log("These are the arguments", args);

    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit is OPEN. Request blocked!");
      }
    }

    try {
      const result = await this.action(...args);
      this.successCount++;
      console.log("success count", this.successCount);

      if (
        this.state === "HALF_OPEN" &&
        this.successCount > this.successThreshold
      ) {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.successCount = 0;
      }

      console.log("results", result);
      return result;
    } catch (err) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        this.nextAttempt = Date.now() + this.timeout;
        this.successCount = 0; // reset
      }

      console.log("we are here");
      throw err;
    }
  }

  getState() {
    return this.state;
  }
}

// Example usage with an async function
const unstableService = async (): Promise<string> => {
  const random = Math.random() < 0.7; // 70% chance to fail
  console.log("this is the number", random);
  if (random) {
    throw new Error("Service failed!");
  }
  return "Success!";
};

const breaker = new CircuitBreaker<string>(unstableService, {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 3000,
});

(async () => {
  for (let i = 0; i < 10; i++) {
    try {
      const result = await breaker.fire();
      console.log("Request OK:", result);
    } catch (e: any) {
      console.log("Error:", e.message, "State:", breaker.getState());
    }
  }
})();
