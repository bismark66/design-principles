# Design Principles

This repository contains small example implementations of classic object-oriented design patterns implemented in TypeScript. The goal is to demonstrate the intent and structure of each pattern with minimal, runnable code.

Top-level organization

- `factory-principle/` — Creational pattern examples (Factory Method, Abstract Factory, and concrete example implementations)
- `logistics/` — Supporting examples used by the factory examples (road/sea logistics)
- `notification.example/` and `payment.example/` — Concrete provider/service examples used by the factories

This README gives a quick project overview and how to run the examples locally.

Requirements

- Node.js 18+ (v24 tested in this workspace)
- npm (or yarn)
- The project uses ES modules + TypeScript. Development runs use `tsx` so you can run `.ts` files directly.

Quickstart

1. Install dependencies:

```bash
npm install
```

2. Run the main example (the project uses `tsx index.js` in `npm start`):

```bash
npm start
```

Notes about TypeScript + ESM

- When running TypeScript files directly with `tsx` or when compiling to ES modules, imports must use the `.js` extension for runtime-resolved imports. Example:

  - In TypeScript source: import type { Provider } from "./interface"; (type-only)
  - For runtime imports that remain in emitted code use: import { SomeClass } from "./some-file.js";

- Interfaces and type aliases are compile-time only. If you need something available at runtime (for instanceof checks, DI, or default implementations), use classes or explicit runtime objects.

What to look at

- `factory-principle/` — implementations and a small `test.ts` runner demonstrating usage.
- `factory-principle/notification.example/` — notification factory example (providers, services)
- `factory-principle/payment.example/` — payment factory example (providers, services)

If something fails with an import like "does not provide an export named X", check whether the file is exporting a TypeScript-only construct (interface/type). Replace re-exports with type-only imports or export as `export interface`/`export type` in the original file and import as `import type { ... }` where appropriate.

Want more?

- I can add per-pattern README files, quick diagrams, and minimal unit tests. Tell me which examples you'd like documented or tested first.
