<script lang="ts">
  import { TOTP } from "totp-generator";
  import { deriveBase32Key } from "$lib/base32";
  import { page } from "$app/state";
  import type { EIP712TypedData } from "$lib/eip712";

  // TODO: Store on device during registration flow
  let secret = $state("SUS6SATXF2ZDQWGB");

  let currentCode = $state("");
  let timer = $state(0);
  let key = $state("");

  const payload = page.url.searchParams.get("payload");
  const safeTx = payload ? (JSON.parse(payload) as EIP712TypedData) : null;
  const safeTxHash = page.url.searchParams.get("safeTxHash");

  const safeAddress = safeTx?.domain.verifyingContract;
  const chainId = safeTx?.domain.chainId;

  const to = safeTx?.message["to"];
  const value = safeTx?.message["value"];
  const data = safeTx?.message["data"];
  const nonce = safeTx?.message["nonce"];

  $effect(() => {
    if (!safeTxHash) {
      return;
    }
    deriveBase32Key(secret, safeTxHash).then((k) => {
      key = k;
      updateCode();
    });
  });

  const updateCode = () => {
    const epoch = Date.now();
    let { otp: token } = TOTP.generate(key, { timestamp: epoch });
    token = token.replace(/(\d{3})(\d{3})/, "$1 $2");
    currentCode = token;
  };

  $effect(() => {
    const updateTime = () => {
      const epoch = Date.now();
      const expire = 30000 - (epoch % 30000);
      timer = Math.floor(expire / 1000) + 1;
      if (timer === 30) {
        updateCode();
      }
    };
    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  });
</script>

<div
  style="background-color: #FFFFFB; font-family: roboboto, sans-serif; padding: 8px;"
>
  <h1>Safe transaction Authenticator</h1>

  {#if safeTx === null}
    <h3 style="color: red">The safeTx is invalid</h3>
  {:else}
    <div style="margin: 30px">
      <div>
        Safe transaction hash:
        <code>{safeTxHash}</code>
      </div>
      <div
        id="timer"
        style="margin-top: 10px; font-weight: bold; font-size: 1.5em"
      ></div>

      <div
        style="display: flex; flex-direction: column; gap: 16px; background: #B8B8D1; padding: 16px; border-radius: 8px"
      >
        <div><b>Safe address:</b> <code>{safeAddress}</code></div>
        <div><b>Chain id:</b> <code>{chainId}</code></div>
        <div><b>To:</b> <code>{to}</code></div>
        <div><b>Value:</b> <code>{value}</code></div>
        <div><b>Data:</b> <code>{data}</code></div>
        <div><b>Nonce:</b> <code>{nonce}</code></div>
      </div>
      <div
        style="background-color: #FFC145; border-radius: 8px; padding: 16px; justify-self: start; margin-top: 16px;"
      >
        <div
          id="currentCode"
          style="font-weight: 700; font-size: 1.5em; margin-top: 16px;"
        >
          Verification Code:
        </div>
        <div
          style="border-radius: 8px; background: #FFFFFB; padding: 8px 16px; font-weight: 700; font-size: 1.5em; margin-bottom: 8px; text-align: center;"
        >
          <code>{currentCode}</code>
        </div>
        <div style="font-weight: 100; font-size: 0.8em">
          New code in: {timer}
        </div>
      </div>
    </div>
  {/if}
</div>
