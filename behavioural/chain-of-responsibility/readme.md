# Chain of Responsibility Pattern Deep Dive

This folder demonstrates the **Chain of Responsibility Pattern**, a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or pass it to the next handler in the chain.

## Pattern Intent & Problem Solved

**Problem**: You need to process requests through multiple validation steps or business rules, but you don't want to hard-code the order of processing or tightly couple the request sender to specific handlers.

**Real-World Analogy**: Think of a customer service call center with escalation levels - a call starts with Level 1 support, and if they can't handle it, it gets escalated to Level 2, then Level 3, and so on. Each level has the opportunity to handle the request or pass it up the chain.

**Solution**: The Chain of Responsibility pattern decouples the request sender from its receivers by giving multiple objects a chance to handle the request. The pattern chains the receiving objects and passes the request along the chain until an object handles it.

## Pattern Structure

```
Client
└── sends request to → Handler (Abstract)
                      ├── handle(request): result
                      └── setNext(handler): Handler
                              ↑
                              │ implements
                    ┌─────────┼─────────┐
         ConcreteHandlerA  ConcreteHandlerB  ConcreteHandlerC
         ├── handle()      ├── handle()      └── handle()
         └── next ────────→└── next ────────→   └── next → null
```

### Key Components:
- **Handler Interface**: Defines the contract for handling requests and chaining
- **BaseChain/Abstract Handler**: Implements the chaining mechanism
- **Concrete Handlers**: Implement specific processing logic for different types of requests
- **Client**: Initiates requests and sets up the chain

## Implementation: Order Processing System

### Scenario
An e-commerce order processing system that needs to validate requests through multiple stages:
1. **Authentication**: Verify user credentials
2. **Validation**: Check request data format and completeness  
3. **Order Processing**: Handle the actual business logic

### Structure Overview
- `interface.ts` — Defines the `Handler` contract
- `base-chain.ts` — Abstract base class implementing chain mechanics
- `chains/auth.ts` — Authentication handler
- `chains/validation.ts` — Data validation handler
- `chains/order.ts` — Order processing handler

### Implementation Analysis

#### Handler Interface
```typescript
export interface Handler {
  setNext(handler: any): Handler;
  handle(request: any): any;
}
```

**Design Decision**: Uses `any` type for flexibility, though in production you'd want stronger typing.

#### Base Chain Implementation
```typescript
export abstract class BaseChain implements Handler {
  private nexthandler: Handler | null = null;
  
  setNext(handler: Handler): Handler {
    this.nexthandler = handler;
    return handler; // Enables fluent chaining: a.setNext(b).setNext(c)
  }

  handle(request: any): any {
    if (this.nexthandler) {
      console.log("handled by base", this.constructor.name);
      return this.nexthandler.handle(request);
    }
    return null; // End of chain reached
  }
}
```

**Key Features**:
- **Fluent Interface**: `setNext()` returns the handler for chaining calls
- **Automatic Forwarding**: Base implementation passes to next handler
- **End-of-Chain Handling**: Returns `null` when no more handlers exist

#### Concrete Handlers

**Authentication Handler**:
```typescript
export class Auth extends BaseChain {
  handle(request: any): any {
    console.log("---");
    if (request.isAuthenticated) {
      console.log("finished authentication");
      return super.handle(request); // Pass to next handler
    }
    console.log("failed in auth");
    return "Authentication failed. Access denied."; // Stop the chain
  }
}
```

**Validation Handler**:
```typescript
export class Validate extends BaseChain {
  handle(request: any): any {
    if (request.isValid) {
      console.log("finished validation");
      return super.handle(request); // Continue chain
    }
    return "Validation failed. Invalid data provided."; // Stop chain
  }
}
```

**Order Processing Handler**:
```typescript
export class Order extends BaseChain {
  handle(request: any): any {
    if (!request.orderDataValid) {
      return "Order processing failed. Invalid order data."; // Stop chain
    }
    console.log("Processing order:", request);
    return super.handle(request); // Continue to next (or end)
  }
}
```

### Usage Example

```typescript
// Set up the chain
const auth = new Auth();
const validator = new Validate();
const orderProcessor = new Order();

// Chain the handlers: Auth → Validation → Order Processing
auth.setNext(validator).setNext(orderProcessor);

// Test successful request
const validRequest = {
  isAuthenticated: true,
  isValid: true,
  orderDataValid: true,
  userId: "user123",
  items: ["item1", "item2"],
  total: 99.99
};

const result = auth.handle(validRequest);
console.log("Result:", result);

// Output:
// ---
// finished authentication
// handled by base Auth
// finished validation  
// handled by base Validate
// Processing order: { isAuthenticated: true, isValid: true, ... }
// handled by base Order
// Result: null (successful completion)

// Test failed authentication
const invalidRequest = {
  isAuthenticated: false,
  isValid: true,
  orderDataValid: true
};

const failedResult = auth.handle(invalidRequest);
console.log("Failed Result:", failedResult);

// Output:
// ---
// failed in auth
// Failed Result: Authentication failed. Access denied.
```

## Chain of Responsibility Variants

### 1. **Pure Chain of Responsibility**
Each handler either processes the request OR passes it to the next handler:

```typescript
class PureHandler extends BaseChain {
  handle(request: any): any {
    if (this.canHandle(request)) {
      return this.processRequest(request); // Stop here
    }
    return super.handle(request); // Pass to next
  }
  
  abstract canHandle(request: any): boolean;
  abstract processRequest(request: any): any;
}
```

### 2. **Chain with Multiple Processing** (Our Implementation)
Handlers can process AND pass the request along:

```typescript
class ProcessingHandler extends BaseChain {
  handle(request: any): any {
    // Do some processing
    this.processRequest(request);
    
    // Always continue the chain (unless error)
    return super.handle(request);
  }
}
```

### 3. **Conditional Chain**
Handlers decide dynamically whether to continue:

```typescript
class ConditionalHandler extends BaseChain {
  handle(request: any): any {
    const result = this.processRequest(request);
    
    if (result.shouldContinue) {
      return super.handle(request);
    }
    
    return result.finalResult;
  }
}
```

## When to Use Chain of Responsibility

### ✅ Use Chain of Responsibility When:
- **Multiple objects can handle a request** but you don't know which one until runtime
- **You want to decouple request senders from receivers**
- **The set of handlers can change dynamically**
- **You need to process requests through multiple validation/processing steps**
- **Order of processing matters** but shouldn't be hard-coded

### ❌ Avoid Chain of Responsibility When:
- **Only one object handles requests** - use direct method calls instead
- **Performance is critical** - the chain adds overhead
- **Request handling is simple** - don't over-engineer
- **The chain is always the same** - consider a pipeline or composite pattern

## Real-World Applications

### Middleware in Web Frameworks
```typescript
// Express.js-style middleware
interface Middleware {
  handle(request: Request, response: Response, next: Function): void;
}

class AuthMiddleware implements Middleware {
  handle(req: Request, res: Response, next: Function): void {
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    next(); // Continue to next middleware
  }
}

class LoggingMiddleware implements Middleware {
  handle(req: Request, res: Response, next: Function): void {
    console.log(`${req.method} ${req.path}`);
    next();
  }
}
```

### Event Processing Systems
```typescript
interface EventHandler {
  setNext(handler: EventHandler): EventHandler;
  handle(event: Event): boolean;
}

class SecurityEventHandler implements EventHandler {
  handle(event: Event): boolean {
    if (event.type === 'SECURITY_BREACH') {
      this.alertSecurity(event);
      return true; // Handled
    }
    return false; // Pass to next handler
  }
}

class LoggingEventHandler implements EventHandler {
  handle(event: Event): boolean {
    this.logEvent(event);
    return false; // Always continue chain for logging
  }
}
```

### Help Desk Systems
```typescript
abstract class SupportHandler {
  protected nextHandler?: SupportHandler;
  
  setNext(handler: SupportHandler): SupportHandler {
    this.nextHandler = handler;
    return handler;
  }
  
  abstract handle(ticket: SupportTicket): string;
}

class Level1Support extends SupportHandler {
  handle(ticket: SupportTicket): string {
    if (ticket.complexity <= 3) {
      return "Resolved by Level 1 Support";
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(ticket);
    }
    return "Unable to resolve ticket";
  }
}

class Level2Support extends SupportHandler {
  handle(ticket: SupportTicket): string {
    if (ticket.complexity <= 7) {
      return "Resolved by Level 2 Support";
    }
    return this.nextHandler?.handle(ticket) || "Escalated to management";
  }
}
```

## Advanced Implementation Patterns

### Typed Chain of Responsibility
```typescript
interface TypedHandler<TRequest, TResponse> {
  setNext(handler: TypedHandler<TRequest, TResponse>): TypedHandler<TRequest, TResponse>;
  handle(request: TRequest): TResponse | null;
}

abstract class TypedBaseHandler<TRequest, TResponse> implements TypedHandler<TRequest, TResponse> {
  private nextHandler?: TypedHandler<TRequest, TResponse>;
  
  setNext(handler: TypedHandler<TRequest, TResponse>): TypedHandler<TRequest, TResponse> {
    this.nextHandler = handler;
    return handler;
  }
  
  handle(request: TRequest): TResponse | null {
    const result = this.doHandle(request);
    if (result !== null) {
      return result;
    }
    
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    
    return null;
  }
  
  protected abstract doHandle(request: TRequest): TResponse | null;
}

// Usage with strong typing
interface OrderRequest {
  userId: string;
  items: OrderItem[];
  total: number;
}

interface OrderResponse {
  orderId: string;
  status: 'success' | 'failed';
  message: string;
}

class TypedAuthHandler extends TypedBaseHandler<OrderRequest, OrderResponse> {
  protected doHandle(request: OrderRequest): OrderResponse | null {
    if (!request.userId) {
      return {
        orderId: '',
        status: 'failed',
        message: 'Authentication required'
      };
    }
    return null; // Pass to next handler
  }
}
```

### Chain with Context
```typescript
interface ChainContext {
  request: any;
  response: any;
  metadata: Map<string, any>;
  stopChain: boolean;
}

abstract class ContextualHandler {
  protected nextHandler?: ContextualHandler;
  
  setNext(handler: ContextualHandler): ContextualHandler {
    this.nextHandler = handler;
    return handler;
  }
  
  handle(context: ChainContext): void {
    this.doHandle(context);
    
    if (!context.stopChain && this.nextHandler) {
      this.nextHandler.handle(context);
    }
  }
  
  protected abstract doHandle(context: ChainContext): void;
}

class RateLimitHandler extends ContextualHandler {
  protected doHandle(context: ChainContext): void {
    const rateLimitExceeded = this.checkRateLimit(context.request);
    if (rateLimitExceeded) {
      context.response = { error: 'Rate limit exceeded' };
      context.stopChain = true;
    }
  }
}
```

### Chain Builder Pattern
```typescript
class ChainBuilder {
  private handlers: Handler[] = [];
  
  addHandler(handler: Handler): ChainBuilder {
    this.handlers.push(handler);
    return this;
  }
  
  addAuthHandler(): ChainBuilder {
    return this.addHandler(new Auth());
  }
  
  addValidationHandler(): ChainBuilder {
    return this.addHandler(new Validate());
  }
  
  addOrderHandler(): ChainBuilder {
    return this.addHandler(new Order());
  }
  
  build(): Handler {
    if (this.handlers.length === 0) {
      throw new Error('Chain must have at least one handler');
    }
    
    for (let i = 0; i < this.handlers.length - 1; i++) {
      this.handlers[i].setNext(this.handlers[i + 1]);
    }
    
    return this.handlers[0];
  }
}

// Usage
const orderChain = new ChainBuilder()
  .addAuthHandler()
  .addValidationHandler()
  .addOrderHandler()
  .build();

const result = orderChain.handle(request);
```

## Common Pitfalls & Solutions

### 1. **Infinite Loops**
```typescript
// ❌ Bad: Can create circular references
const handler1 = new Auth();
const handler2 = new Validate();
handler1.setNext(handler2);
handler2.setNext(handler1); // Creates infinite loop!

// ✅ Good: Validate chain structure
class SafeChainBuilder {
  private addedHandlers = new Set<Handler>();
  
  addHandler(handler: Handler): SafeChainBuilder {
    if (this.addedHandlers.has(handler)) {
      throw new Error('Handler already exists in chain - would create cycle');
    }
    this.addedHandlers.add(handler);
    this.handlers.push(handler);
    return this;
  }
}
```

### 2. **Memory Leaks**
```typescript
// ❌ Bad: Handlers hold references indefinitely
class LeakyHandler extends BaseChain {
  private processedRequests: any[] = []; // Grows indefinitely
  
  handle(request: any): any {
    this.processedRequests.push(request);
    // ...
  }
}

// ✅ Good: Clean up resources
class CleanHandler extends BaseChain {
  private processedRequests: any[] = [];
  private readonly maxCacheSize = 1000;
  
  handle(request: any): any {
    this.addToCache(request);
    // ...
  }
  
  private addToCache(request: any): void {
    this.processedRequests.push(request);
    if (this.processedRequests.length > this.maxCacheSize) {
      this.processedRequests.shift(); // Remove oldest
    }
  }
}
```

### 3. **Error Handling**
```typescript
// ✅ Proper error handling in chain
abstract class RobustHandler extends BaseChain {
  handle(request: any): any {
    try {
      const result = this.doHandle(request);
      if (result !== null) {
        return result;
      }
      return super.handle(request);
    } catch (error) {
      this.handleError(error, request);
      throw error; // Re-throw or handle gracefully
    }
  }
  
  protected abstract doHandle(request: any): any;
  
  protected handleError(error: Error, request: any): void {
    console.error(`Error in ${this.constructor.name}:`, error);
    // Log, notify, or handle error appropriately
  }
}
```

## Performance Considerations

### Chain Length Optimization
```typescript
// Monitor chain performance
class PerformanceMonitoringHandler extends BaseChain {
  handle(request: any): any {
    const start = performance.now();
    const result = super.handle(request);
    const duration = performance.now() - start;
    
    if (duration > 100) { // Threshold in milliseconds
      console.warn(`Slow chain execution: ${duration}ms`);
    }
    
    return result;
  }
}
```

### Caching Chain Results
```typescript
class CachingChainHandler extends BaseChain {
  private cache = new Map<string, any>();
  
  handle(request: any): any {
    const cacheKey = this.getCacheKey(request);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = super.handle(request);
    this.cache.set(cacheKey, result);
    
    return result;
  }
  
  private getCacheKey(request: any): string {
    return JSON.stringify(request);
  }
}
```

## Testing Chain of Responsibility

### Unit Testing Individual Handlers
```typescript
describe('Auth Handler', () => {
  it('should pass authenticated requests to next handler', () => {
    const auth = new Auth();
    const mockNext = jest.fn().mockReturnValue('next handler result');
    auth.setNext(mockNext as any);
    
    const authenticatedRequest = { isAuthenticated: true };
    const result = auth.handle(authenticatedRequest);
    
    expect(mockNext).toHaveBeenCalledWith(authenticatedRequest);
    expect(result).toBe('next handler result');
  });
  
  it('should reject unauthenticated requests', () => {
    const auth = new Auth();
    const unauthenticatedRequest = { isAuthenticated: false };
    
    const result = auth.handle(unauthenticatedRequest);
    
    expect(result).toBe('Authentication failed. Access denied.');
  });
});
```

### Integration Testing Chain Behavior
```typescript
describe('Order Processing Chain', () => {
  it('should process valid orders successfully', () => {
    const auth = new Auth();
    const validator = new Validate();
    const orderProcessor = new Order();
    
    auth.setNext(validator).setNext(orderProcessor);
    
    const validRequest = {
      isAuthenticated: true,
      isValid: true,
      orderDataValid: true,
      orderId: 'order-123'
    };
    
    const result = auth.handle(validRequest);
    expect(result).toBeNull(); // Successful completion
  });
  
  it('should stop at first validation failure', () => {
    const auth = new Auth();
    const validator = new Validate();
    const orderProcessor = new Order();
    
    auth.setNext(validator).setNext(orderProcessor);
    
    const invalidRequest = {
      isAuthenticated: true,
      isValid: false, // Invalid data
      orderDataValid: true
    };
    
    const result = auth.handle(invalidRequest);
    expect(result).toBe('Validation failed. Invalid data provided.');
  });
});
```

## Extending the Order Processing Example

### Adding New Handlers
```typescript
// New handler for inventory checking
class InventoryCheck extends BaseChain {
  handle(request: any): any {
    if (!this.checkInventory(request.items)) {
      return "Inventory check failed. Items out of stock.";
    }
    console.log("Inventory check passed");
    return super.handle(request);
  }
  
  private checkInventory(items: any[]): boolean {
    // Check if items are in stock
    return items.every(item => item.quantity > 0);
  }
}

// New handler for payment processing
class PaymentProcessor extends BaseChain {
  handle(request: any): any {
    if (!this.processPayment(request.paymentInfo)) {
      return "Payment processing failed.";
    }
    console.log("Payment processed successfully");
    return super.handle(request);
  }
  
  private processPayment(paymentInfo: any): boolean {
    // Process payment logic
    return paymentInfo && paymentInfo.amount > 0;
  }
}

// Updated chain setup
const setupOrderChain = () => {
  const auth = new Auth();
  const validator = new Validate();
  const inventoryCheck = new InventoryCheck();
  const paymentProcessor = new PaymentProcessor();
  const orderProcessor = new Order();
  
  return auth
    .setNext(validator)
    .setNext(inventoryCheck)
    .setNext(paymentProcessor)
    .setNext(orderProcessor);
};
```

### Configuration-Driven Chain
```typescript
interface HandlerConfig {
  type: string;
  enabled: boolean;
  order: number;
  params?: any;
}

class ConfigurableChainFactory {
  private handlerFactories = new Map<string, () => BaseChain>();
  
  constructor() {
    this.handlerFactories.set('auth', () => new Auth());
    this.handlerFactories.set('validate', () => new Validate());
    this.handlerFactories.set('inventory', () => new InventoryCheck());
    this.handlerFactories.set('payment', () => new PaymentProcessor());
    this.handlerFactories.set('order', () => new Order());
  }
  
  createChain(configs: HandlerConfig[]): BaseChain {
    const enabledConfigs = configs
      .filter(config => config.enabled)
      .sort((a, b) => a.order - b.order);
    
    if (enabledConfigs.length === 0) {
      throw new Error('At least one handler must be enabled');
    }
    
    const handlers = enabledConfigs.map(config => {
      const factory = this.handlerFactories.get(config.type);
      if (!factory) {
        throw new Error(`Unknown handler type: ${config.type}`);
      }
      return factory();
    });
    
    // Chain handlers together
    for (let i = 0; i < handlers.length - 1; i++) {
      handlers[i].setNext(handlers[i + 1]);
    }
    
    return handlers[0];
  }
}

// Usage
const config: HandlerConfig[] = [
  { type: 'auth', enabled: true, order: 1 },
  { type: 'validate', enabled: true, order: 2 },
  { type: 'inventory', enabled: false, order: 3 }, // Disabled
  { type: 'payment', enabled: true, order: 4 },
  { type: 'order', enabled: true, order: 5 }
];

const factory = new ConfigurableChainFactory();
const chain = factory.createChain(config);
```

## Best Practices & Recommendations

### Design Guidelines
1. **Keep handlers focused** - Each handler should have a single responsibility
2. **Make chains configurable** - Don't hard-code the chain structure
3. **Handle errors gracefully** - Don't let exceptions break the chain
4. **Provide clear feedback** - Return meaningful results from each handler
5. **Consider performance** - Monitor chain execution time

### Code Organization
```typescript
// Organize by responsibility
handlers/
├── auth/
│   ├── auth-handler.ts
│   └── auth-handler.test.ts
├── validation/
│   ├── validation-handler.ts
│   └── validation-handler.test.ts
├── processing/
│   ├── order-handler.ts
│   └── order-handler.test.ts
└── base/
    ├── base-handler.ts
    ├── handler.interface.ts
    └── chain-builder.ts
```

### Error Recovery
```typescript
abstract class RecoverableHandler extends BaseChain {
  protected maxRetries = 3;
  
  handle(request: any): any {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return this.doHandle(request);
      } catch (error) {
        if (attempt === this.maxRetries) {
          return this.handleFailure(error, request);
        }
        console.warn(`Handler ${this.constructor.name} attempt ${attempt} failed:`, error);
      }
    }
  }
  
  protected abstract doHandle(request: any): any;
  
  protected handleFailure(error: Error, request: any): any {
    return `Handler ${this.constructor.name} failed after ${this.maxRetries} attempts`;
  }
}
```

## Comparison with Other Patterns

| Pattern | Purpose | Key Difference |
|---------|---------|----------------|
| **Chain of Responsibility** | Pass request through chain of handlers | Dynamic handler selection, request can be handled by any handler in chain |
| **Command** | Encapsulate requests as objects | Focuses on request encapsulation, not chaining |
| **Decorator** | Add behavior dynamically | Adds functionality while maintaining interface |
| **Strategy** | Select algorithm at runtime | Selects one algorithm, not a chain of processing |
| **Pipeline** | Sequential data transformation | All stages process data, no conditional stopping |

## Next Steps & Extensions

### Planned Enhancements
- **Async Chain Support**: Handlers that return Promises
- **Parallel Processing**: Handlers that can process in parallel
- **Conditional Branching**: Chains that can split based on conditions
- **Event-Driven Chains**: Handlers triggered by events
- **Monitoring Integration**: Built-in performance and error monitoring

### Learning Exercises
1. **Add logging handler** that tracks request processing time
2. **Implement retry logic** for failed handlers
3. **Create a priority-based chain** where handlers are ordered by priority
4. **Build an async version** that handles Promise-based operations
5. **Add circuit breaker functionality** to handle failing handlers

The Chain of Responsibility pattern is powerful for building flexible, extensible systems where the processing logic can change at runtime. Your ordering system implementation demonstrates the core concepts effectively and provides a solid foundation for more complex scenarios.