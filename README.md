_Disclaimer: This project is just a Proof of concept. Neither the code nor the cryptographic approach has actually been reviewed. This should not be used in production_

## Overview

This project is a proof of concept for adding a off-chain multifactor authentication on top of Safe signers using a TOTP Authenticator App.

The idea is to close the gap between web app and mobile app by enforcing Multifactor authentication for individual signers.
In order to submit a signature for a Safe transaction you would need to send the signature along a TOTP code. Only if both are valid the signature will be accepted and stored.
This forces users to use different devices (e.g. Web App and Authenticator App) similar to a banking TAN. The TOTP code generation incorporates a secret that will be exchanged with the Authenticator device during registration as well as the safe transaction data. This way a TOTP code is always only valid for a specific transaction.

## How it works

- The device and backend exchange a Base32 secret key.
- Using this device we derive an HKDF key
- We derive a new key using the secret with the Safe transaction hash as salt
- Using this new key and the current epoch we calculate a TOTP code
- The backend (CGW) does the same to verify that the TOTP code is correct and rejects the signature otherwise

## Running it locally

Install the dependencies:

```bash
yarn
```

Run it locally:

```bash
yarn dev

```

This command will run the app locally under http://localhost:5173

The project currently requires 2 query parameters:

- payload: The TypedData of the SafeTransaction
- safeTxHash: The safe transaction hash (this should be computed on the device from the payload in production)
