# Design Principles: A Comprehensive TypeScript Implementation

This repository contains well-documented, runnable implementations of classic **Gang of Four (GoF) design patterns** in TypeScript. Each pattern is demonstrated through practical, real-world scenarios with multiple examples, comprehensive documentation, and clear before/after code comparisons.

## 🎯 Project Philosophy

**Goal**: Make design patterns accessible and practical through minimal yet complete implementations that you can:
- **Run immediately** (`npm start`)
- **Understand quickly** (extensive documentation with real-world analogies)
- **Extend easily** (modular structure with clear interfaces)
- **Apply confidently** (practical guidance on when to use each pattern)

**Approach**: Each pattern includes multiple examples ranging from simple demonstrations to complex real-world integrations, showing not just *how* but *when* and *why* to use each pattern.

## 📁 Repository Structure

```
design-principles/
├── creational/          # Object creation patterns
│   └── factory-principle/
│       ├── factory.ts           # Abstract factory base
│       ├── logistics/           # Transport factory examples
│       ├── notification.example/ # Email/SMS provider factories
│       ├── payment.example/     # Payment gateway factories
│       └── readme.md           # Comprehensive factory pattern guide
├── structural/          # Object composition patterns
│   └── adapter/
│       ├── logger.example/      # Legacy logger integration
│       ├── payment.example/     # Legacy PayPal integration
│       └── readme.md           # Complete adapter pattern documentation
├── test.ts             # Main test runner demonstrating all patterns
├── index.js            # Entry point
└── package.json        # ES modules + TypeScript setup
```

## 🏗️ Implemented Patterns

### Creational Patterns
Focused on object creation mechanisms that increase flexibility and code reuse.

#### ✅ Factory Method Pattern (`creational/factory-principle/`)
**Intent**: Create objects without specifying their exact classes, enabling runtime decision-making about which class to instantiate.

**Examples Implemented**:
- **Logistics System**: `SeaLogistics` vs `RoadLogistics` creating `Ship` vs `Truck` objects
- **Notification Services**: `EmailService` and `SmsService` creating different provider implementations
  - Email providers: Postmark, Mailgun, MailChimp
  - SMS providers: Hubtel, Helio
- **Payment Gateways**: `StripePayment` and `MtnMomoPayment` with async factory methods

**Key Benefits Demonstrated**:
```typescript
// Runtime provider switching without code changes
const emailService = new EmailService("mailgun");  // Easy to switch providers
await emailService.sendEmail();                    // Provider creation is encapsulated

// Environment-based configuration
const paymentService = process.env.REGION === 'africa' 
  ? new MtnMomoPayment() 
  : new StripePayment();
```

**📖 [Complete Factory Pattern Documentation →](creational/factory-principle/readme.md)**

### Structural Patterns
Focused on object composition and relationships between entities.

#### ✅ Adapter Pattern (`structural/adapter/`)
**Intent**: Allow incompatible interfaces to work together by wrapping existing classes with new interfaces.

**Examples Implemented**:
- **Logger Integration**: Bridge between modern `ILoggerAdapter.log()` interface and legacy `LegacyLogger.writeLog()`
- **Payment System**: Integrate legacy `LegacyPayPal.makePayment()` with modern `PaymentAdapterGateway.charge()` interface

**Key Benefits Demonstrated**:
```typescript
// Before: Incompatible interfaces
const legacyLogger = new LegacyLogger();           // Has writeLog(msg)
// Can't use with modern interface expecting log(message)

// After: Seamless integration via adapter
const adapter = new LoggerAdapter(legacyLogger);
const modernLogger: ILoggerAdapter = adapter;      // Now compatible!
modernLogger.log("Hello World");                   // Works perfectly
```

**📖 [Complete Adapter Pattern Documentation →](structural/adapter/readme.md)**

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** (tested with v24)
- **npm** or **yarn**

### Installation & Running
```bash
# 1. Clone and install dependencies
git clone <your-repo-url>
cd design-principles
npm install

# 2. Run all pattern demonstrations
npm start

# 3. Run specific pattern tests
npx tsx test.ts                           # All patterns
npx tsx creational/factory-principle/test.ts  # Just factory examples
```

### What You'll See
The test runner demonstrates:
- **Factory Pattern**: Creating logistics, notification, and payment services
- **Adapter Pattern**: Integrating legacy logger and payment systems
- **Runtime Configuration**: Switching between providers and implementations

```bash
# Sample output:
Delivering by Sea transport
Sending email via MailChimp...
Sending SMS via Hubtel...
Making payment via Stripe...
Processing payment via MTN MoMo...
Paid 200 using Legacy PayPal!
legacy logger: This is a test log message.
```

## 💡 Learning Paths

### 🎯 For Beginners
**Start here if you're new to design patterns:**

1. **Understand the Problem** → Read pattern documentation to see real-world scenarios
2. **See the Solution** → Examine before/after code comparisons in each example
3. **Run the Code** → Execute examples to see patterns in action
4. **Experiment** → Modify examples to try different configurations

**Recommended Order**:
1. **Factory Pattern** (`creational/factory-principle/`) - Fundamental creation pattern
2. **Adapter Pattern** (`structural/adapter/`) - Essential for legacy integration

### 🚀 For Experienced Developers
**Focus on advanced implementations and architectural considerations:**

- **Factory Pattern**: Study the async factory methods, configuration-driven selection, and error handling strategies
- **Adapter Pattern**: Examine validation layers, caching implementations, and testing strategies
- **Cross-Pattern Integration**: See how patterns work together in `test.ts`

### 📚 For Architects
**Analyze pattern relationships and system design:**

- **When to Combine Patterns**: Factory + Adapter for legacy system modernization
- **Performance Considerations**: Object pooling, lazy initialization, caching strategies
- **Testing Strategies**: Mock adapters, factory testing patterns
- **Migration Patterns**: Gradual legacy system replacement strategies

## 🔧 Technical Implementation Details

### TypeScript + ES Modules Setup
This project demonstrates modern TypeScript practices with ES modules:

```json
// package.json
{
  "type": "module",           // Enable ES modules
  "scripts": {
    "start": "tsx index.js"   // Run TypeScript directly with tsx
  }
}
```

### Key Technical Decisions

#### ✅ Runtime Import Extensions
```typescript
// ✅ Correct: .js extension for runtime resolution
import { EmailService } from './services/email-service.js';

// ❌ Wrong: Missing extension causes runtime errors
import { EmailService } from './services/email-service';
```

#### ✅ Type-Only Imports
```typescript
// ✅ Interfaces are compile-time only
import type { Provider } from './interface.js';

// ✅ Classes/functions available at runtime
import { PostmarkEmailProvider } from './providers/postmark.js';
```

#### ✅ Interface Export Patterns
```typescript
// ✅ Direct exports work with ES modules
export interface Provider { notify(): void; }

// ❌ Re-exports of interfaces can fail at runtime
export { Provider } from './interface';  // Avoid this pattern
```

### Dependencies & Tooling
- **tsx**: Direct TypeScript execution without compilation step
- **TypeScript 5.x**: Latest language features and type checking
- **ES Modules**: Modern module system with proper tree-shaking support

## 🎨 Pattern Design Philosophy

### Factory Pattern Implementation
**Core Principle**: "Define an interface for creating objects, but let subclasses decide which class to instantiate."

**Our Implementation Strategy**:
- **Abstract base classes** define the creation interface
- **Concrete factories** implement specific creation logic
- **Runtime configuration** enables provider switching
- **Multiple examples** show scalability from simple to complex

### Adapter Pattern Implementation
**Core Principle**: "Convert the interface of a class into another interface clients expect."

**Our Implementation Strategy**:
- **Clean separation** between target interface and legacy system
- **Zero modification** of existing legacy code
- **Comprehensive error handling** for legacy system quirks
- **Performance optimization** through caching and validation layers

## 🧪 Testing & Quality Assurance

### Test Structure
The project includes comprehensive testing approaches:

```typescript
// test.ts - Integration testing
export function main() {
  testLogistics(seaLogistics);        // Factory pattern
  testNotification(emailService);     // Provider factories
  testAdapter(paypalAdaptor);         // Adapter pattern
}
```

### Testing Patterns Demonstrated

#### Factory Testing
```typescript
// Test factory behavior, not implementation details
const emailService = new EmailService("mailgun");
await emailService.sendEmail();  // Focuses on factory contract
```

#### Adapter Testing
```typescript
// Test adapter translation, mock the adaptee
const mockLegacy = { writeLog: jest.fn() };
const adapter = new LoggerAdapter(mockLegacy);
adapter.log("test");  // Verify delegation works correctly
```

### Quality Metrics
- **Type Safety**: Full TypeScript coverage with strict settings
- **Interface Compliance**: All implementations follow defined contracts
- **Error Handling**: Graceful degradation for legacy system failures
- **Performance**: Minimal overhead from pattern implementation

## 🛠️ Extending the Examples

### Adding New Factory Types
1. **Define the product interface**:
```typescript
export interface DatabaseConnection {
  connect(): Promise<void>;
  query(sql: string): Promise<any>;
}
```

2. **Create abstract factory**:
```typescript
abstract class DatabaseFactory {
  abstract createConnection(): DatabaseConnection;
  
  async executeQuery(sql: string): Promise<any> {
    const connection = this.createConnection();
    await connection.connect();
    return connection.query(sql);
  }
}
```

3. **Implement concrete factories**:
```typescript
class MySQLFactory extends DatabaseFactory {
  createConnection(): DatabaseConnection {
    return new MySQLConnection();
  }
}
```

### Adding New Adapter Types
1. **Identify incompatible interfaces**:
```typescript
// Your app expects this
interface FileStorage {
  save(filename: string, data: Buffer): Promise<void>;
}

// Legacy system provides this
class LegacyFileSystem {
  writeFile(path: string, content: Buffer): void { /* sync operation */ }
}
```

2. **Create adapter**:
```typescript
class FileSystemAdapter implements FileStorage {
  constructor(private legacy: LegacyFileSystem) {}
  
  async save(filename: string, data: Buffer): Promise<void> {
    // Convert async interface to sync legacy call
    return new Promise((resolve, reject) => {
      try {
        this.legacy.writeFile(filename, data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### Import/Export Errors
```bash
# Error: "Cannot use import statement outside a module"
# Solution: Ensure package.json has "type": "module"

# Error: "does not provide an export named 'Provider'"
# Solution: Use type-only imports for interfaces
import type { Provider } from './interface.js';
```

#### Runtime Module Resolution
```bash
# Error: "Cannot find module './interface'"
# Solution: Add .js extension to imports
import { SomeClass } from './some-file.js';
```

#### TypeScript Compilation
```bash
# Error: Interface re-export issues
# Solution: Use direct exports
export interface Provider { ... }  // Instead of export { Provider }
```

### Performance Optimization
- **Factory Objects**: Use object pooling for expensive-to-create products
- **Adapter Caching**: Cache adapted results for frequently accessed data
- **Lazy Loading**: Initialize heavy dependencies only when needed

## 🤝 Contributing

### Project Standards
- **TypeScript**: Use strict type checking and explicit types
- **ES Modules**: Follow modern module patterns
- **Documentation**: Include comprehensive README for new patterns
- **Examples**: Provide multiple use cases (simple → complex)
- **Testing**: Add integration tests demonstrating pattern usage

### Adding New Patterns
1. **Create pattern folder**: `mkdir behavioral/strategy`
2. **Implement examples**: Multiple real-world scenarios
3. **Write documentation**: Follow existing README structure
4. **Add tests**: Demonstrate pattern benefits
5. **Update main README**: Add pattern to overview

### Code Style
```typescript
// Use descriptive names that reveal intent
class EmailNotificationFactory extends NotificationFactory {
  createProvider(): EmailProvider {
    return this.providers[this.selectedType];
  }
}

// Prefer composition over inheritance where appropriate
class ConfigurableAdapter implements Target {
  constructor(
    private adaptee: Adaptee,
    private config: AdapterConfig
  ) {}
}
```

## 🔮 Roadmap

### Planned Pattern Additions

#### Behavioral Patterns
- **Strategy Pattern**: Multiple algorithm implementations (sorting, payment processing)
- **Observer Pattern**: Event-driven architectures (notification systems)
- **Command Pattern**: Request/response handling with undo capabilities
- **State Pattern**: State machine implementations

#### Advanced Structural Patterns
- **Decorator Pattern**: Feature enhancement without inheritance
- **Facade Pattern**: Simplified interfaces to complex subsystems
- **Composite Pattern**: Tree-structured object hierarchies

#### Enterprise Patterns
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transactional data operations
- **Dependency Injection**: Inversion of control container

### Infrastructure Improvements
- **CI/CD Pipeline**: Automated testing and deployment
- **Unit Test Suite**: Comprehensive test coverage with Jest
- **Performance Benchmarks**: Pattern overhead measurements
- **Interactive Documentation**: Executable examples in documentation

## 📖 Resources & Further Reading

### Design Patterns Literature
- **"Design Patterns" by Gang of Four**: Original pattern catalog
- **"Head First Design Patterns"**: Beginner-friendly explanations
- **"Patterns of Enterprise Application Architecture"**: Large-scale system patterns

### TypeScript & Modern JavaScript
- **TypeScript Handbook**: Official language documentation
- **ES Modules Guide**: Modern module system best practices
- **Node.js ES Modules**: Runtime considerations and gotchas

### Related Projects
- **Pattern implementations in other languages**
- **Enterprise application examples**
- **Microservices pattern libraries**

---

## 📄 License & Attribution

**License**: ISC  
**Author**: Bismark Agyare  
**Purpose**: Educational resource for understanding and implementing design patterns

Feel free to use these examples as learning resources, extend them for your projects, or contribute improvements back to the community.

**Star this repository** if you find it helpful for learning design patterns! 🌟


