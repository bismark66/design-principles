# Factory Pattern Deep Dive

This folder demonstrates the **Factory Method** and **Abstract Factory** creational design patterns through practical TypeScript examples. These patterns solve the problem of creating objects without specifying their exact classes, promoting loose coupling and extensibility.

## Pattern Intent & Problem Solved

**Problem**: When your code is tightly coupled to specific classes, adding new types requires modifying existing code throughout your application. For example, if you hard-code `new PostmarkEmailProvider()` everywhere, switching to Mailgun requires finding and changing every instantiation.

**Solution**: The Factory pattern encapsulates object creation logic, allowing you to:
- Create objects through a common interface without knowing their concrete types
- Add new implementations without modifying existing client code
- Configure which implementation to use at runtime
- Centralize creation logic for easier maintenance

## Pattern Structure

### Factory Method Pattern
```
Creator (Abstract)
├── factoryMethod(): Product (abstract)
└── someOperation(): void (uses factoryMethod())

ConcreteCreator extends Creator
└── factoryMethod(): ConcreteProduct (concrete implementation)

Product (Interface)
└── operation(): void

ConcreteProduct implements Product
└── operation(): void (specific implementation)
```

### Abstract Factory Pattern
```
AbstractFactory (Interface)
├── createProductA(): AbstractProductA
└── createProductB(): AbstractProductB

ConcreteFactory implements AbstractFactory
├── createProductA(): ConcreteProductA
└── createProductB(): ConcreteProductB
```

## Implementation Examples

### 1. Notification System (`notification.example/`)

**Structure Overview**:
- `Provider` interface — Common contract for all notification providers
- `NotificationFactory` abstract class — Defines creation method and convenience operations
- Concrete services (`EmailService`, `SMSService`) — Implement specific provider creation logic
- Provider implementations — (`PostmarkEmailProvider`, `MailgunEmailProvider`, etc.)

**Key Files**:
- `interface.ts` — Defines the `Provider` contract and type aliases
- `factory.ts` — Abstract `NotificationFactory` with `createProvider()` method
- `services/email-service.ts` — Concrete factory for email providers
- `email-providers/` — Concrete provider implementations

**Benefits Demonstrated**:
```typescript
// Before Factory Pattern (tightly coupled):
const emailProvider = new PostmarkEmailProvider();
emailProvider.notify();

// With Factory Pattern (loosely coupled):
const emailService = new EmailService("mailgun"); // Easy to switch providers
await emailService.sendEmail(); // Provider creation is encapsulated
```

**Runtime Configuration**: The `EmailService` constructor accepts a provider type, demonstrating how factories enable runtime decision-making:

```typescript
class EmailService extends NotificationFactory {
  constructor(provider?: EmailProviderType) {
    // Provider selection happens at runtime
    this.provider = provider;
  }

  createProvider(): Provider {
    const selectedProvider = this.provider || "postmark";
    return this.providers[selectedProvider]; // Factory method implementation
  }
}
```

### 2. Payment System (`payment.example/`)

**Structure Overview**:
- `PaymentGateway` interface — Common contract for payment operations
- `PaymentFactory` abstract class — Defines async creation pattern
- Concrete implementations — Stripe, MTN MoMo payment gateways
- Services layer — Bridges business logic with payment providers

**Async Factory Pattern**: This example demonstrates factory patterns with asynchronous operations:

```typescript
abstract class PaymentFactory {
  abstract createPaymentGateWay(): Promise<PaymentGateway>;

  async makePayment(): Promise<void> {
    const paymentGateway = await this.createPaymentGateWay();
    return paymentGateway.Pay();
  }
}
```

### 3. Logistics System (Core Example)

**Structure Overview**:
- Transport products (`Ship`, `Truck`) with common interface
- Logistics factories (`SeaLogistics`, `RoadLogistics`) 
- Demonstrates the classic Factory Method scenario

**Pattern Benefits Illustrated**:

1. **Open/Closed Principle**: Add new transport types without modifying existing code
2. **Single Responsibility**: Each factory handles one type of transport creation
3. **Dependency Inversion**: High-level logistics code depends on abstractions, not concrete classes

## Factory Pattern Variants in This Codebase

### 1. **Simple Factory** (Static Creation)
Basic object creation with a single method:
```typescript
class ProviderFactory {
  static create(type: string): Provider {
    switch(type) {
      case "postmark": return new PostmarkEmailProvider();
      case "mailgun": return new MailgunEmailProvider();
      default: throw new Error("Unknown provider");
    }
  }
}
```

### 2. **Factory Method** (Template Method + Factory)
Abstract class defines the algorithm, subclasses provide specific creation:
```typescript
// Abstract creator
abstract class NotificationFactory {
  abstract createProvider(): Provider; // Factory method

  async sendEmail(): Promise<void> {
    const provider = this.createProvider(); // Uses factory method
    return provider.notify();
  }
}

// Concrete creator
class EmailService extends NotificationFactory {
  createProvider(): Provider { // Implements factory method
    return this.providers[this.selectedType];
  }
}
```

### 3. **Abstract Factory** (Family of Related Objects)
Creates families of related products:
```typescript
// Could be extended to create complete notification "suites"
interface NotificationSuite {
  createEmailProvider(): EmailProvider;
  createSMSProvider(): SMSProvider;
  createPushProvider(): PushProvider;
}

class EnterpriseNotificationSuite implements NotificationSuite {
  // Creates enterprise-grade providers with consistent features
}
```

## When to Use Factory Patterns

### ✅ Use Factory Method When:
- You need to delegate object creation to subclasses
- The exact class to instantiate is determined at runtime
- You want to localize knowledge of which class to create
- You need to provide hooks for extending object creation

### ✅ Use Abstract Factory When:
- You need to create families of related products
- You want to ensure products from the same family are used together
- You need to configure your application with different product families

### ❌ Avoid Factory Patterns When:
- Object creation is simple and unlikely to change
- You're over-engineering a straightforward problem
- The abstraction adds complexity without clear benefits

## Code Quality & Best Practices

### Dependency Management
This codebase demonstrates proper dependency management:
- Interfaces define contracts, not implementations
- Factories return interface types, not concrete classes
- Client code depends on abstractions

### Configuration Patterns
Multiple configuration approaches shown:
```typescript
// 1. Constructor injection
new EmailService("mailgun")

// 2. Runtime switching
emailService.switchProvider("postmark")

// 3. Environment-based
const provider = process.env.EMAIL_PROVIDER || "postmark"
```

### Error Handling
Production factories should include:
```typescript
createProvider(): Provider {
  const provider = this.providers[this.selectedType];
  if (!provider) {
    throw new Error(`Unknown provider: ${this.selectedType}`);
  }
  return provider;
}
```

## Real-World Applications

### Scalability Scenarios
1. **Multi-Region Deployments**: Different regions might require different payment processors or email providers due to local regulations or partnerships
2. **A/B Testing**: Easily switch between provider implementations to test performance or costs
3. **Graceful Degradation**: If primary provider fails, factory can instantiate backup provider
4. **Feature Flags**: Enable/disable provider features without code changes

### Integration Examples
```typescript
// Environment-based factory selection
const createNotificationService = () => {
  const provider = process.env.NODE_ENV === 'production' 
    ? 'postmark' 
    : 'mailgun';
  return new EmailService(provider);
};

// Configuration-driven factory
const createPaymentService = (config: AppConfig) => {
  return config.region === 'africa' 
    ? new MTNMomoService(config.mtnConfig)
    : new StripeService(config.stripeConfig);
};
```

### Testing Benefits
Factories make unit testing significantly easier:
```typescript
// Mock factory for testing
class MockNotificationFactory extends NotificationFactory {
  createProvider(): Provider {
    return {
      notify: jest.fn().mockResolvedValue(true)
    };
  }
}

// Test becomes focused on business logic, not provider details
const service = new MockNotificationFactory();
await service.sendEmail(); // Tests factory pattern, not email sending
```

## Common Pitfalls & Solutions

### 1. **Over-Engineering Simple Cases**
```typescript
// ❌ Overkill for simple scenarios
class ColorFactory {
  createColor(type: string): Color {
    switch(type) {
      case 'red': return new RedColor();
      case 'blue': return new BlueColor();
    }
  }
}

// ✅ Simple object literal suffices
const colors = {
  red: new RedColor(),
  blue: new BlueColor()
};
```

### 2. **Factory vs Service Confusion**
- **Factory**: Creates objects (`createEmailProvider()`)
- **Service**: Performs operations (`sendEmail()`)
- **This codebase**: Combines both for convenience (Factory Method pattern)

### 3. **Type Safety with Dynamic Creation**
```typescript
// ✅ Type-safe factory with proper generics
interface ProviderFactory<T extends Provider> {
  createProvider(): T;
}

class EmailServiceFactory implements ProviderFactory<EmailProvider> {
  createProvider(): EmailProvider { // Return type is constrained
    return new PostmarkEmailProvider();
  }
}
```

## Advanced Factory Patterns

### Registry Pattern
For dynamic provider registration:
```typescript
class ProviderRegistry {
  private providers = new Map<string, new() => Provider>();

  register(name: string, providerClass: new() => Provider) {
    this.providers.set(name, providerClass);
  }

  create(name: string): Provider {
    const ProviderClass = this.providers.get(name);
    if (!ProviderClass) throw new Error(`Provider ${name} not found`);
    return new ProviderClass();
  }
}
```

### Dependency Injection Integration
```typescript
// Factory as injectable service
@Injectable()
class NotificationServiceFactory {
  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {}

  createProvider(): Provider {
    const providerType = this.config.get('EMAIL_PROVIDER');
    this.logger.log(`Creating provider: ${providerType}`);
    return this.providers[providerType];
  }
}
```

## Comparison with Other Patterns

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| **Factory Method** | Create objects through inheritance | Need subclass-specific creation |
| **Abstract Factory** | Create families of objects | Multiple related products |
| **Builder** | Construct complex objects step-by-step | Complex initialization |
| **Prototype** | Clone existing objects | Expensive object creation |
| **Singleton** | Ensure single instance | Global access point needed |

## Performance Considerations

### Object Pooling with Factories
```typescript
class PooledProviderFactory {
  private pool: Provider[] = [];

  createProvider(): Provider {
    return this.pool.pop() || new ExpensiveProvider();
  }

  returnProvider(provider: Provider): void {
    this.pool.push(provider);
  }
}
```

### Lazy Initialization
```typescript
class LazyEmailService extends NotificationFactory {
  private _provider?: Provider;

  createProvider(): Provider {
    if (!this._provider) {
      this._provider = new PostmarkEmailProvider();
    }
    return this._provider;
  }
}
```## TypeScript & Runtime Considerations

### ESM + TypeScript Setup
When running TypeScript with ES modules (as this project does):

```typescript
// ✅ Type-only imports (compile-time)
import type { Provider } from './interface.js';

// ✅ Runtime imports (need .js extension)
import { PostmarkEmailProvider } from './providers/postmark.js';

// ❌ Missing extension (runtime error)
import { PostmarkEmailProvider } from './providers/postmark';
```

### Interface Export Patterns
TypeScript interfaces don't exist at runtime, which affects how you structure exports:

```typescript
// ✅ Direct export (recommended)
export interface Provider {
  notify(): void;
}

// ❌ Re-export from factory file (runtime error)
export { Provider } from './interface'; // Can't re-export interfaces at runtime

// ✅ Alternative: Use abstract classes for runtime polymorphism
export abstract class Provider {
  abstract notify(): void;
}
```

### Type Safety Best Practices
```typescript
// ✅ Constrained factory with proper typing
class TypedProviderFactory<T extends Provider> {
  private providers: Map<string, new() => T> = new Map();

  register<U extends T>(name: string, provider: new() => U): void {
    this.providers.set(name, provider);
  }

  create(name: string): T {
    const ProviderClass = this.providers.get(name);
    if (!ProviderClass) {
      throw new Error(`Provider '${name}' not registered`);
    }
    return new ProviderClass();
  }
}
```

## How to Run & Extend

### Quick Start
1. Install dependencies:
```bash
npm install
```

2. Run examples:
```bash
npm start
# or run specific tests:
npx tsx factory-principle/test.ts
```

### Adding New Providers
1. **Create provider implementation**:
```typescript
// email-providers/sendgrid-provider.ts
import type { Provider } from '../interface.js';

export class SendGridEmailProvider implements Provider {
  notify(): void {
    console.log("Sending email via SendGrid...");
  }
}
```

2. **Register in service**:
```typescript
// services/email-service.ts
import { SendGridEmailProvider } from '../email-providers/sendgrid-provider.js';

class EmailService extends NotificationFactory {
  providers = {
    postmark: new PostmarkEmailProvider(),
    mailgun: new MailgunEmailProvider(),
    sendgrid: new SendGridEmailProvider(), // Add here
  };
}
```

3. **Update type definitions**:
```typescript
// interface.ts
export type EmailProviderType = "postmark" | "mailgun" | "sendgrid";
```

### Creating New Factory Categories
Follow the established pattern:
1. Define common interface in `interface.ts`
2. Create abstract factory class
3. Implement concrete providers
4. Create service classes that extend the factory
5. Add tests to verify functionality

## Next Steps & Extensions

Want to dive deeper? Consider adding:

- **Unit tests** with Jest to verify factory behavior
- **Configuration management** for provider selection
- **Monitoring/logging** integration for provider performance
- **Circuit breaker pattern** for provider fallback
- **Provider health checks** and automatic failover
- **Metrics collection** for provider usage analytics

The factory pattern foundation here supports all these advanced features without requiring major refactoring—that's the power of good abstraction!
