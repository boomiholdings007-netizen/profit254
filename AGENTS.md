# Architecture rules
- Keep the prediction engine pure and shared by chart and settlement so displayed prices determine outcomes.
- Store demo trades in session React state; real trading and payments stay unavailable until a verified payment service and authenticated backend are connected.
- Use the shared Button variants and dialog sheet for consistent tactile controls and accessible overlays.
