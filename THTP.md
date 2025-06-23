# Algorithm

## Notations

- **K** is a key derived from a secret that is exchanged between prover and verifier during the registration process
- **X** represents the time step in seconds (default value X =
  30 seconds)
- **T0** is the Unix time to start counting time steps (default value is
  0, i.e., the Unix epoch)
- **H** is the Keccak256 hash of the transaction data (e.g. the `eth_signTypedData` payload)
- **HOTP** is the algorithm described in [RFC-4226](https://datatracker.ietf.org/doc/html/rfc4226)
- **HMAC_SHA_256** is the algorithm described in [RFC-2104](https://datatracker.ietf.org/doc/html/rfc2104)

## Description

We define a new function **THTP** (Transaction-hash-time-based-password) as

`THTP = HOTP(K’, T)`

Where:

`K’ = HMAC_SHA_256(K, H)`

This means:

1. We derive a **transaction-specific subkey** `K'` from the secret key `K` and the hash of the transaction `H`.
2. Then, we use this subkey `K'` in a standard **TOTP** flow (e.g., `HOTP(K', T)`).

## Full Steps

1. Let `H = keccak256(tx_data)` (the hash of the transaction).
2. Let `K' = HMAC-SHA256(K, H)`.
3. Let `T = floor((unix_time - T0) / X)`, as per standard TOTP.
4. Compute `THTP = HOTP(K', T)` → i.e., `AUTH_CODE = Truncate(HMAC-SHA1(K', T))`.

This ensures that:

- The TAN changes every time the tx data changes.
- The TAN expires every X seconds (time-bound).
- An attacker without K cannot forge or predict a valid code for any H.
