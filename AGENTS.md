# Architecture rules
- Keep the prediction engine pure and shared by chart and settlement so displayed prices determine outcomes.
- Store demo trades in session React state; real trading and payments stay unavailable until a verified payment service and authenticated backend are connected.
- Use the shared Button variants and dialog sheet for consistent tactile controls and accessible overlays.
- Keep preview profile and preferences in session React state; mock Google must never claim identity verification or enable real trading.
- Normalize probability calculations by each asset's movement scale; display currency preference must never alter KES settlement amounts.
