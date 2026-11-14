# Structural Patterns

Compose objects into larger structures, or adapt/insulate interfaces. Reach for
these at integration seams and where object composition needs shaping.

Format: **Intent · When · When NOT · Tradeoffs · Misuse.**

## Adapter
- **Intent:** Convert one interface into another the client expects.
- **When:** Integrating an external/legacy API whose shape you don't control.
- **When NOT:** Wrapping your own, already-suitable interface. Don't adapt what you
  can just change.
- **Tradeoffs:** +isolates external shape/change; −extra layer.
- **Misuse:** Adapters over stable, owned interfaces (pure indirection).

## Bridge
- **Intent:** Separate an abstraction from its implementation so both vary
  independently (avoid a class explosion across two axes).
- **When:** Two orthogonal dimensions of variation (e.g. shape × rendering backend).
- **When NOT:** Only one axis varies — that's a plain interface.
- **Tradeoffs:** +independent variation; −more indirection up front.
- **Misuse:** Applied where composition of one interface already suffices.

## Composite
- **Intent:** Treat individual objects and compositions uniformly via a common
  interface (trees).
- **When:** Genuine part-whole hierarchies (file systems, UI trees, org charts).
- **When NOT:** Flat collections — no tree, no Composite.
- **Tradeoffs:** +uniform recursion; −can over-generalize leaf vs node semantics.

## Decorator
- **Intent:** Add responsibilities to an object dynamically by wrapping it, keeping
  the same interface.
- **When:** Layered, combinable behaviors (buffering + compression + encryption on a
  stream); you want to add without subclass explosion.
- **When NOT:** A single fixed enhancement — just add it. Deep wrap stacks hurt
  debuggability.
- **Tradeoffs:** +composable, open/closed; −many small objects, harder stack traces.
- **Misuse:** Decorators where a parameter or a couple of if-branches would do.

## Facade
- **Intent:** One simplified interface over a complex subsystem.
- **When:** A messy/large subsystem has a common usage path worth simplifying.
- **When NOT:** The subsystem is already simple. A facade over one class is noise.
- **Tradeoffs:** +easier use, decouples clients from internals; −can hide needed power.
- **Misuse:** "Service" facades that just forward one-to-one to another class.

## Flyweight
- **Intent:** Share immutable intrinsic state across many objects to save memory.
- **When:** Huge numbers of similar objects (glyphs, tiles, particles) strain memory.
- **When NOT:** Object counts are modest — premature memory optimization.
- **Tradeoffs:** +big memory savings at scale; −complexity, intrinsic/extrinsic split.

## Proxy
- **Intent:** A stand-in controlling access to another object (lazy load, remote,
  caching, access control).
- **When:** You need to interpose behavior on access (virtual/remote/protection/caching proxy).
- **When NOT:** No cross-cutting access concern exists.
- **Tradeoffs:** +transparent interposition; −hidden behavior can surprise callers.
- **Misuse:** Proxy layers that add latency/indirection for no real access concern.

**Adapter vs Facade vs Decorator vs Proxy:** Adapter *changes* an interface; Facade
*simplifies* many into one; Decorator *adds* behavior keeping the interface; Proxy
*controls access* keeping the interface.
