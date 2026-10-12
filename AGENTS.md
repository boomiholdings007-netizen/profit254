# Architecture rules
- Keep the prediction engine pure and shared by chart and settlement so displayed prices determine outcomes.
- Store demo trades in session React state; real trading and payments stay unavailable until a verified payment service and authenticated backend are connected.
- Use the shared Button variants and dialog sheet for consistent tactile controls and accessible overlays.
- Keep preview profile and preferences in session React state; mock Google must never claim identity verification or enable real trading.
- Normalize probability calculations by each asset's movement scale; display currency preference must never alter KES settlement amounts.
- Keep exchange transport in a separate hook; chart and practice settlement use its timestamped quote history, and stale closing quotes void the round rather than inventing a payout.
- Provide external database DDL as an offline setup file with read-only authenticated grants; only trusted server operations may mutate financial records.

- Use one valid Binance combined stream and block all crypto entries until fresh timestamped quotes arrive; no simulated fallback may settle crypto.
- Sample synthetic jump diffusion at the asset cadence through the shared pure engine; advertised ranges are calibration scales, not guaranteed bounds.
- Carry tied practice positions once against the original target; second ties refund and uncertain exchange closes void.
- Cashier anticipation is explicitly simulated and unverified fee bands block confirmation; real completion requires trusted gateway confirmation.
