# Shot Tracker Server Architecture

## Purpose

This document explains the current backend structure, the architectural rules behind it, and the direction for future development.

The goal is to keep the codebase modular, testable, and easy to grow over time while staying pragmatic. The current `auth` and `golfer` modules already show the intended shape of the application.

---

## Current High-Level Structure

```text
src/
  app/
    createApp.js
  infrastructure/
  modules/
    auth/
    golfer/
    identity/   // placeholder
    build-service-container.js
  server.js
```

### Responsibilities

#### `src/server.js`

The process entrypoint.

It is responsible for:

- loading environment variables
- starting the application
- selecting the port
- calling `app.listen(...)`

It should also become the place for:

- database startup
- cache startup
- graceful shutdown handling
- process-level logging for startup failures

#### `src/app/createApp.js`

The Express application factory.

It is responsible for:

- creating the Express app
- registering shared middleware
- registering routes
- exposing a ready-to-use app instance

This separation keeps HTTP app composition testable without coupling app creation to process startup.

#### `src/infrastructure/`

Shared technical concerns only.

This folder is for app-level infrastructure such as:

- database connection/bootstrap
- cache clients (for example Redis)
- config loading/parsing
- logging
- shared technical adapters or utilities

This folder should **not** become a place for business logic.

#### `src/modules/`

Business modules.

Each module owns its own:

- domain
- application logic
- infrastructure implementation for that module
- HTTP wiring
- module composition

Examples:

- `auth`
- `golfer`
- later `identity`

#### `src/modules/build-service-container.js`

Composition root for modules.

It is responsible for:

- creating cross-cutting services and middleware
- wiring modules together
- returning the app-level dependency container

This keeps composition centralized while preserving module boundaries.

---

## Core Architectural Rules

### 1. Business logic lives in modules

Domain and use-case behavior should live inside modules, not in shared infrastructure.

Examples:

- golfer creation rules belong in the golfer module
- auth behavior belongs in the auth module
- future identity management belongs in the identity module

### 2. Shared infrastructure handles technical setup, not business workflows

Infrastructure should provide technical capabilities such as:

- database connections
- cache clients
- configuration
- logging

It should not own business use-cases.

### 3. Repositories own persistence behavior

Actual reads and writes belong in repository implementations inside the relevant module.

Examples:

- `findBySub`
- `create`
- `findById`
- future update and query methods

This keeps persistence behavior close to the use-cases that need it.

### 4. Avoid a generic "DB service" for all queries

Do **not** build a single shared service with generic methods such as:

- `db.find(collection, query)`
- `db.insert(collection, data)`
- `db.update(collection, filter, update)`

That pattern weakens module boundaries and usually leads to an anemic data-access layer.

### 5. Application services depend on repository interfaces, not database libraries

Services should depend on repository contracts.
They should **not** depend directly on:

- Mongoose
- Mongo collections
- SQL clients
- ORM models

This keeps the application layer persistence-agnostic.

### 6. Mappers isolate domain from persistence shape

Persistence-specific structures should not leak into the domain.

Mappers are responsible for:

- converting persistence records/documents into domain entities
- converting domain entities into persistence-friendly data

### 7. Module root files compose the module

Each module should have an `index.js` that composes its internal parts and exposes the module surface.

This keeps module assembly local and explicit.

### 8. HTTP handlers stay thin

Handlers should:

- read request data
- call application services
- return responses
- pass failures to error middleware

They should not contain domain rules or persistence logic.

### 9. Prefer incremental growth over speculative abstraction

Add abstractions when they help real use-cases.
Do not over-engineer early.

The current structure is intentionally simple but extensible.

---

## Current Request Flow

The existing authentication-to-golfer flow works like this:

1. User authenticates via Cognito through the auth module.
2. Auth middleware resolves the identity from the access token.
3. Identity data is placed onto `req.userData`.
4. HTTP handler calls the golfer application service.
5. Golfer service looks up a local golfer by identity.
6. If a golfer does not exist, the service creates one.
7. Repository persists/fetches the record.
8. Mapper keeps domain and persistence concerns separated.

This is the current “get or create local user from authenticated identity” flow.

---

## Database Strategy Going Forward

### Goal

Support multiple database technologies over time without forcing the application layer to know about them.

The application should be able to work with different persistence implementations such as:

- MongoDB via Mongoose
- SQL via a query builder or ORM
- a mock or in-memory implementation for tests/proof of concept

### Important Principle

We want **pluggable persistence implementations**, not one generic repository for the whole system.

That means:

- repository interfaces stay in modules
- implementations can vary by database type
- the composition root decides which implementation to wire in

### Recommended Shape

```text
src/
  infrastructure/
    persistence/
      create-database-client.js
      mongo/
        connect-mongo.js
      sql/
        connect-sql.js
```

And inside modules:

```text
src/modules/golfer/
  domain/
    entities/
    interfaces/
  application/
  infrastructure/
    persistence/
      mongo/
        golfer-model.js
        golfer-mapper.js
        mongoose-golfer-repository.js
      sql/
        sql-golfer-repository.js
  index.js
```

### How it should work

#### Shared infrastructure layer

A shared database bootstrap should:

- read config
- determine which database type is active
- create and connect the correct database client
- return a database context object

Example idea:

```js
{
  type: "mongo",
  client: mongoose,
}
```

or

```js
{
  type: "sql",
  client: sqlClient,
}
```

#### Module composition layer

The module root should choose the correct repository implementation based on the database context.

For example:

- if `database.type === "mongo"`, use `MongooseGolferRepository`
- if `database.type === "sql"`, use `SqlGolferRepository`

#### Application layer

The application layer should not change.
It still talks to `IGolferRepository`.

This is the key to keeping the design flexible.

---

## What Shared Database Code Should Do

A shared database module should handle:

- connection lifecycle
- startup and shutdown
- configuration
- health/readiness checks
- creation of the low-level database client/context

It should **not** handle:

- module-specific queries
- domain-specific filtering rules
- generic business persistence workflows

---

## What Module Repositories Should Do

Repositories should handle:

- use-case driven queries
- persistence reads/writes for that module
- mapping to and from domain entities
- database-specific implementation details hidden behind the repository contract

Examples in the golfer module:

- `findBySub({ sub })`
- `create({ golfer })`
- future `findById({ id })`
- future `updateProfile({ golfer })`

---

## Why This Structure Works Well

### Testability

- services can be tested with mocked repository interfaces
- repository implementations can be tested separately
- app creation can be tested without starting the process
- database bootstrapping can be tested in isolation

### Modularity

Each module owns its business logic and persistence behavior.

### Replaceable infrastructure

Switching from Mongo to SQL for a proof of concept becomes a composition problem, not an application rewrite.

### Clear ownership

- infrastructure owns technical setup
- modules own business behavior
- app factory owns Express composition
- server owns runtime startup

---

## Recommended Next Steps

### Phase 1: Add shared database bootstrap

Create a shared persistence layer under `src/infrastructure/persistence/`.

Suggested first files:

- `createDatabaseClient.js`
- `mongo/connectMongo.js`
- optionally later `sql/connectSql.js`

### Phase 2: Pass database context into composition

Update `build-service-container.js` so it can receive shared infrastructure dependencies such as:

- database context
- cache client
- config

### Phase 3: Make module composition select repo implementations

Update module `index.js` files so repository implementations are chosen based on active database type.

### Phase 4: Keep application services unchanged

Services should continue to depend only on repository interfaces.

### Phase 5: Add graceful shutdown

Later, `server.js` should close open infrastructure resources cleanly:

- HTTP server
- Mongo connection
- SQL connection pool
- Redis client

---

## Practical Rules to Preserve Going Forward

1. Do not let services call Mongoose models directly.
2. Do not introduce a generic all-purpose database service for queries.
3. Keep repository interfaces inside modules.
4. Keep repository implementations database-specific.
5. Keep shared database code focused on connection/lifecycle/configuration.
6. Keep HTTP handlers thin.
7. Keep module `index.js` files responsible for module composition.
8. Prefer incremental refactoring over speculative abstraction.
9. When adding new infrastructure like Redis, treat it like shared technical infrastructure, not business logic.
10. Choose abstractions that preserve module boundaries first.

---

## Final Principle

The application should be **domain-driven and module-first**, while infrastructure remains **replaceable and subordinate** to the needs of the modules.

That means:

- the domain model drives the shape of the app
- repositories protect the application layer from persistence details
- shared infrastructure enables the system but does not define the business

That is the architectural direction this project should continue following.
