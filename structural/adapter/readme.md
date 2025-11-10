# Adapter Pattern Deep Dive

This folder demonstrates the **Adapter Pattern**, a structural design pattern that allows objects with incompatible interfaces to collaborate. Think of it as a translator that enables communication between systems that speak different "languages."

## Pattern Intent & Problem Solved

**Problem**: You have existing code (legacy systems, third-party libraries, or different APIs) that you can't modify, but you need to integrate it with your current application that expects a different interface.

**Real-World Analogy**: Just like a power adapter allows you to plug a US device into a European outlet, the Adapter pattern allows incompatible interfaces to work together without modifying the original code.

**Solution**: The Adapter pattern wraps an existing class with a new interface, acting as a bridge between the client code and the legacy system.

## Pattern Structure

```
Client
└── uses → Target Interface
              ↑
              │ implements
         Adapter Class
              │ contains
              ↓
         Adaptee (Legacy Class)
```

### Key Components:

- **Target Interface**: The interface your application expects to work with
- **Adaptee**: The existing class with incompatible interface (legacy code)
- **Adapter**: The wrapper class that implements Target Interface and translates calls to Adaptee
- **Client**: Your application code that uses the Target Interface

## Implementation Examples

### 1. Logger System Integration (`logger.example/`)

**Scenario**: Your application expects loggers to implement `ILoggerAdapter.log(message)`, but you have a legacy logging system that uses `LegacyLogger.writeLog(msg)`.

**Structure Overview**:

- `ILoggerAdapter` — Target interface your app expects
- `LegacyLogger` — Existing logger with different method signature
- `LoggerAdapter` — Adapter that bridges the gap

**Before Adapter Pattern (Problematic)**:

```typescript
// Legacy logger with incompatible interface
class LegacyLogger {
  writeLog(msg: string): void {
    console.log("legacy logger: " + msg);
  }
}

// Your app expects this interface
interface ILoggerAdapter {
  log(message: string): void;
}

// ❌ Can't use legacy logger directly - interface mismatch!
const logger: ILoggerAdapter = new LegacyLogger(); // Type error!
```

**After Adapter Pattern (Solution)**:

```typescript
class LoggerAdapter implements ILoggerAdapter {
  private legacyLogger: LegacyLogger;

  constructor(legacyLogger: LegacyLogger) {
    this.legacyLogger = legacyLogger;
  }

  log(message: string): void {
    // Translate the call to legacy interface
    this.legacyLogger.writeLog(message);
  }
}

// ✅ Now it works seamlessly!
const legacyLogger = new LegacyLogger();
const adapter: ILoggerAdapter = new LoggerAdapter(legacyLogger);
adapter.log("Hello World"); // Output: "legacy logger: Hello World"
```

**Benefits Demonstrated**:

1. **Zero modification** of legacy code
2. **Clean separation** between new interface and old implementation
3. **Reusable adapter** for multiple legacy loggers
4. **Type safety** maintained throughout

### 2. Payment Gateway Integration (`payment.example/`)

**Scenario**: Your e-commerce system expects payment gateways to implement `PaymentAdapterGateway.charge(amount)`, but you need to integrate with a legacy PayPal system that uses `LegacyPayPal.makePayment(total)`.

**Structure Overview**:

- `PaymentAdapterGateway` — Target interface for payment processing
- `LegacyPayPal` — Existing PayPal implementation with different API
- `PaypalAdaptor` — Adapter that translates between interfaces

**Implementation Analysis**:

```typescript
// Target interface expected by your system
interface PaymentAdapterGateway {
  charge(amount: number): void;
}

// Legacy system with different method naming
class LegacyPayPal {
  makePayment(total: number) {
    console.log(`Paid ${total} using Legacy PayPal!`);
  }
}

// Adapter bridges the gap
class PaypalAdaptor implements PaymentAdapterGateway {
  private legacyPaypal: LegacyPayPal;

  constructor(legacyPaypal: LegacyPayPal) {
    this.legacyPaypal = legacyPaypal;
  }

  charge(amount: number): void {
    // Translate charge() call to makePayment() call
    const payment = this.legacyPaypal.makePayment(amount);
    return payment;
  }
}
```

**Usage in Application**:

```typescript
// Your app can now work with any payment gateway through common interface
class PaymentProcessor {
  private gateways: PaymentAdapterGateway[] = [];

  addGateway(gateway: PaymentAdapterGateway): void {
    this.gateways.push(gateway);
  }

  processPayment(amount: number): void {
    // Use any gateway without knowing its implementation details
    this.gateways[0].charge(amount);
  }
}

// Integration is seamless
const processor = new PaymentProcessor();
const legacyPayPal = new LegacyPayPal();
const paypalAdapter = new PaypalAdaptor(legacyPayPal);

processor.addGateway(paypalAdapter); // Works with legacy system!
processor.processPayment(100); // Output: "Paid 100 using Legacy PayPal!"
```

## Adapter Pattern Variants

### 1. **Object Adapter** (Composition-based)

Uses composition to wrap the adaptee - this is what our examples demonstrate:

```typescript
class Adapter implements Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }

  method(): void {
    this.adaptee.specificMethod();
  }
}
```

### 2. **Class Adapter** (Inheritance-based)

Uses inheritance (multiple inheritance where supported):

```typescript
// In languages supporting multiple inheritance
class Adapter extends Adaptee implements Target {
  method(): void {
    this.specificMethod(); // Inherited from Adaptee
  }
}
```

**TypeScript Note**: TypeScript doesn't support multiple inheritance of classes, so we use the Object Adapter approach with composition.

### 3. **Two-Way Adapter**

Adapters that can work in both directions:

```typescript
class TwoWayAdapter implements ModernInterface, LegacyInterface {
  private modern: ModernClass;
  private legacy: LegacyClass;

  // Implements both interfaces for bidirectional compatibility
  modernMethod(): void {
    /* delegates to legacy */
  }
  legacyMethod(): void {
    /* delegates to modern */
  }
}
```

## When to Use Adapter Pattern

### ✅ Use Adapter Pattern When:

- **Legacy system integration**: You can't modify existing code but need to use it
- **Third-party library integration**: External APIs have different interfaces than expected
- **API version compatibility**: Supporting multiple versions of the same API
- **Code reuse**: Want to reuse existing classes with incompatible interfaces
- **Testing**: Creating test doubles for external dependencies

### ❌ Avoid Adapter Pattern When:

- **You can modify the source**: If you own the code, direct refactoring might be better
- **Simple interface differences**: Minor differences might not justify the overhead
- **Performance critical**: The extra layer adds slight overhead
- **Over-abstraction**: Don't create adapters for future needs that may never materialize

## Real-World Applications

### Database Integration

```typescript
// Your app expects this interface
interface DatabaseAdapter {
  save(data: any): Promise<void>;
  find(id: string): Promise<any>;
}

// Legacy MySQL wrapper
class LegacyMySQLClient {
  insert(record: any): Promise<void> {
    /* ... */
  }
  select(primaryKey: string): Promise<any> {
    /* ... */
  }
}

// Adapter bridges the gap
class MySQLAdapter implements DatabaseAdapter {
  constructor(private client: LegacyMySQLClient) {}

  async save(data: any): Promise<void> {
    return this.client.insert(data);
  }

  async find(id: string): Promise<any> {
    return this.client.select(id);
  }
}
```

### API Integration

```typescript
// Different REST API structures
interface WeatherService {
  getCurrentWeather(city: string): Promise<WeatherData>;
}

class OpenWeatherMapAPI {
  fetchWeather(location: string): Promise<OpenWeatherResponse> {
    /* ... */
  }
}

class WeatherAPIAdapter implements WeatherService {
  constructor(private api: OpenWeatherMapAPI) {}

  async getCurrentWeather(city: string): Promise<WeatherData> {
    const response = await this.api.fetchWeather(city);
    // Transform response format to match expected interface
    return {
      temperature: response.main.temp,
      humidity: response.main.humidity,
      conditions: response.weather[0].description,
    };
  }
}
```

### Testing and Mocking

```typescript
// Adapter for testing external services
class MockPaymentAdapter implements PaymentAdapterGateway {
  charge(amount: number): void {
    console.log(`Mock payment: $${amount} charged successfully`);
    // No actual payment processing in tests
  }
}

// Easy to switch between real and mock implementations
const paymentGateway =
  process.env.NODE_ENV === "test"
    ? new MockPaymentAdapter()
    : new PaypalAdaptor(new LegacyPayPal());
```

## Advanced Adapter Patterns

### Configuration-Driven Adapters

```typescript
interface AdapterConfig {
  retryAttempts: number;
  timeout: number;
  errorHandling: "throw" | "log" | "ignore";
}

class ConfigurableAdapter implements Target {
  constructor(private adaptee: Adaptee, private config: AdapterConfig) {}

  async method(): Promise<void> {
    for (let i = 0; i < this.config.retryAttempts; i++) {
      try {
        await this.adaptee.operation();
        break;
      } catch (error) {
        if (this.config.errorHandling === "throw") throw error;
        if (this.config.errorHandling === "log") console.error(error);
        // Continue or break based on configuration
      }
    }
  }
}
```

### Adapter with Validation

```typescript
class ValidatingAdapter implements PaymentAdapterGateway {
  constructor(private adaptee: LegacyPayPal) {}

  charge(amount: number): void {
    // Add validation layer
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
    if (amount > 10000) {
      throw new Error("Amount exceeds maximum limit");
    }

    // Delegate to adaptee
    this.adaptee.makePayment(amount);
  }
}
```

### Caching Adapter

```typescript
class CachingAdapter implements Target {
  private cache = new Map<string, any>();

  constructor(private adaptee: Adaptee) {}

  method(input: string): any {
    if (this.cache.has(input)) {
      return this.cache.get(input);
    }

    const result = this.adaptee.operation(input);
    this.cache.set(input, result);
    return result;
  }
}
```

## Common Pitfalls & Solutions

### 1. **Leaky Abstraction**

```typescript
// ❌ Bad: Adapter exposes adaptee implementation details
class BadAdapter implements Target {
  constructor(public adaptee: LegacyClass) {} // Public exposure

  method(): LegacyResult {
    // Returns adaptee-specific type
    return this.adaptee.operation();
  }
}

// ✅ Good: Adapter properly encapsulates adaptee
class GoodAdapter implements Target {
  constructor(private adaptee: LegacyClass) {} // Private

  method(): StandardResult {
    // Returns target-compatible type
    const legacyResult = this.adaptee.operation();
    return this.transformToStandardResult(legacyResult);
  }
}
```

### 2. **Error Handling Inconsistency**

```typescript
// ✅ Consistent error handling in adapter
class RobustAdapter implements Target {
  constructor(private adaptee: LegacyClass) {}

  method(): void {
    try {
      this.adaptee.operation();
    } catch (legacyError) {
      // Transform legacy errors to standard format
      throw new StandardError(
        `Adapter error: ${legacyError.message}`,
        legacyError.code
      );
    }
  }
}
```

### 3. **Performance Overhead**

```typescript
// ✅ Efficient adapter with minimal overhead
class EfficientAdapter implements Target {
  private cachedAdaptee?: Adaptee;

  constructor(private createAdaptee: () => Adaptee) {}

  method(): void {
    // Lazy initialization to avoid unnecessary object creation
    if (!this.cachedAdaptee) {
      this.cachedAdaptee = this.createAdaptee();
    }
    this.cachedAdaptee.operation();
  }
}
```

## Comparison with Other Patterns

| Pattern       | Purpose                                           | Key Difference                                         |
| ------------- | ------------------------------------------------- | ------------------------------------------------------ |
| **Adapter**   | Make incompatible interfaces work together        | Changes interface without changing functionality       |
| **Decorator** | Add new functionality to existing objects         | Adds behavior while maintaining interface              |
| **Facade**    | Provide simplified interface to complex subsystem | Simplifies rather than adapts                          |
| **Bridge**    | Separate abstraction from implementation          | Designed for variation, not compatibility              |
| **Proxy**     | Control access to another object                  | Focuses on access control, not interface compatibility |

## Testing Adapter Implementations

### Unit Testing Adapters

```typescript
describe("LoggerAdapter", () => {
  it("should delegate log calls to legacy logger", () => {
    // Arrange
    const mockLegacyLogger = {
      writeLog: jest.fn(),
    } as jest.Mocked<LegacyLogger>;

    const adapter = new LoggerAdapter(mockLegacyLogger);

    // Act
    adapter.log("test message");

    // Assert
    expect(mockLegacyLogger.writeLog).toHaveBeenCalledWith("test message");
  });
});
```

### Integration Testing

```typescript
describe("PaymentAdapter Integration", () => {
  it("should process payments end-to-end", async () => {
    // Use real legacy implementation in integration test
    const legacyPayPal = new LegacyPayPal();
    const adapter = new PaypalAdaptor(legacyPayPal);

    // Verify the full flow works
    expect(() => adapter.charge(100)).not.toThrow();
  });
});
```

## How to Extend These Examples

### Adding New Legacy Integrations

1. **Identify the target interface** your application expects
2. **Analyze the legacy system** interface and behavior
3. **Create an adapter class** that implements the target interface
4. **Handle data transformation** between different formats
5. **Add error handling** for legacy system quirks
6. **Write tests** for both happy path and error scenarios

### Example: Adding a New Logger Adapter

```typescript
// 1. Legacy system with different interface
class DatabaseLogger {
  writeToDb(level: string, msg: string): Promise<void> {
    return Promise.resolve(); // Database write logic
  }
}

// 2. Create adapter
class DatabaseLoggerAdapter implements ILoggerAdapter {
  constructor(private dbLogger: DatabaseLogger) {}

  log(message: string): void {
    // Transform synchronous call to async
    this.dbLogger
      .writeToDb("INFO", message)
      .catch((error) => console.error("Database logging failed:", error));
  }
}

// 3. Use seamlessly with existing code
const adapter = new DatabaseLoggerAdapter(new DatabaseLogger());
adapter.log("Database operation completed"); // Works with existing interface!
```

## Next Steps & Best Practices

### Recommended Extensions

- **Add logging/monitoring** to adapters for debugging legacy integrations
- **Implement retry logic** for unreliable legacy systems
- **Create adapter factories** for complex initialization scenarios
- **Add configuration management** for adapter behavior
- **Implement health checks** for legacy system availability

### Architecture Considerations

- **Keep adapters lightweight** - they should translate, not add business logic
- **Document legacy system quirks** that the adapter handles
- **Version your adapters** when legacy systems change
- **Monitor adapter performance** as they can become bottlenecks
- **Plan migration strategy** if you eventually want to replace legacy systems

The Adapter pattern is your bridge between the old and new, enabling gradual modernization without breaking existing functionality. It's essential for any system that needs to integrate with external libraries, legacy code, or third-party APIs while maintaining clean architecture principles.
