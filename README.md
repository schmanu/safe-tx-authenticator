_Disclaimer: This project is just a Proof of concept. Neither the code nor the cryptographic approach has actually been reviewed. This should not be used in production_

# Overview

This project is a proof of concept for adding a off-chain multifactor authentication on top of Safe signers using a TOTP Authenticator App.

The idea is to close the gap between web app and mobile app by enforcing Multifactor authentication for individual signers.
In order to submit a signature for a Safe transaction you would need to send the signature along a TOTP code. Only if both are valid the signature will be accepted and stored.
This forces users to use different devices (e.g. Web App and Authenticator App) similar to a banking TAN. The TOTP code generation incorporates a secret that will be exchanged with the Authenticator device during registration as well as the safe transaction data. This way a TOTP code is always only valid for a specific transaction.

For more details about the algorithm, see [THTP.md](./THTP.md).

# Running it locally

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
