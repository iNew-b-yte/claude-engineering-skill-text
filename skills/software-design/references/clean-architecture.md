# Clean / Hexagonal Architecture

A way to keep business logic independent of frameworks, UI, and infrastructure so it
stays testable and durable. Powerful for complex, long-lived domains — **overkill
for simple CRUD.**

## The dependency rule (the whole point)
Source-code dependencies point **inward**, toward higher-level policy. Inner layers
know nothing about outer layers.

```
        (outermost) Frameworks & Drivers  — web, DB, UI, external APIs
                    Interface Adapters     — controllers, presenters, gateways, repos
                    Application (Use Cases)— orchestrates domain to fulfill a use case
        (innermost) Entities / Domain      — enterprise rules, pure, dependency-free
```

- **Entities/Domain** — core rules and invariants; no framework imports.
- **Use cases** — application-specific orchestration; depend on domain + on *ports*.
- **Interface adapters** — translate between use cases and the outside world.
- **Frameworks/drivers** — the volatile detail; swappable.

## Ports & Adapters (hexagonal — same idea, different framing)
- **Ports** = interfaces the application defines for what it needs (e.g.
  `PaymentGateway`, `OrderRepository`) and what it offers (driving ports).
- **Adapters** = concrete implementations (Stripe adapter, Postgres adapter, REST
  controller). The application depends on ports; adapters depend on the application.
- Dependency inversion at the boundary is what keeps the core clean and testable.

## When it's worth it
- Complex domain logic with real invariants, expected to live and change for years.
- Need to test business rules without DB/network/framework.
- Multiple delivery mechanisms (HTTP + jobs + CLI) or swappable infrastructure.
- Large team benefiting from strict boundaries.

## When it's NOT worth it
- Small CRUD services — a controller → service → ORM structure is fine and clearer.
- Thin apps where the "domain" is just data + validation.
- Prototypes / short-lived tools.

**Do not** create this for a 3-endpoint service:
```
domain/ application/ infrastructure/ ports/ adapters/ repositories/ usecases/ factories/
```
The folder tree is not the architecture; the **dependency direction** is. You can
honor the dependency rule with far fewer folders.

## Common mistakes
- Ceremony without the dependency rule (folders named right, imports pointing wrong).
- Mapping the same data through 4 near-identical DTO layers "for purity."
- Putting anemic entities inside and all logic in services (missed the point).
- Letting framework annotations/ORM entities leak into the domain core.

## Pragmatic middle ground
A **modular monolith** with clear module boundaries and dependency discipline gets
most of the benefit with far less ceremony than full clean architecture. Prefer it
until complexity demands more.
