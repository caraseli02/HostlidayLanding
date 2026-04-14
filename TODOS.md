# TODOS

## Validate travel data source feasibility before scaling provider integrations

What:
Prove which hotel, activity, and attraction sources are legally and technically usable in production before broadening the provider stack.

Why:
The current plan assumes source access will work, but robots restrictions, ToS limits, rate limits, or missing APIs can invalidate the architecture.

Pros:
- Prevents building on unavailable or non-compliant data sources
- Forces the provider list to be real, not aspirational
- Reduces later rework in retrieval, trust states, and freshness logic

Cons:
- Slows down expansion work
- May reveal weaker coverage than hoped for in early markets

Context:
The eng review accepted a single-source-stack v1 for speed, but the outside voice flagged source feasibility as a structural risk. This is deferred, not resolved. Revisit before adding more providers or broadening beyond the initial Barcelona implementation.

Depends on / blocked by:
- Initial v1 trust validation
- Decision on which providers are essential to the first production version

## Add evidence provenance behind trust labels

What:
Store the source URL, check timestamp, raw verification state, and conflict flag for each recommendation so trust labels are explainable and debuggable.

Why:
The current plan uses visible trust states like `verified today` and `unverified`, but without underlying provenance those labels may be impossible to defend when users question them or when bad recommendations slip through.

Pros:
- Makes trust labels auditable
- Improves debugging when data conflicts or becomes stale
- Creates a cleaner path to stronger trust UX later

Cons:
- Adds persistence and response-shape complexity
- Increases schema surface area early

Context:
The outside voice flagged the current trust-state model as too thin without provenance. This is deferred, not resolved. Revisit before expanding trust claims or using verification language more aggressively in the UI.

Depends on / blocked by:
- Initial trust-state implementation
- Decision on how recommendation records are stored in Postgres
