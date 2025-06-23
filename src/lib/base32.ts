const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const encodeBase32 = (bytes: number[] | Uint8Array) => {
  let bits = "";
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, "0");
  }
  return (
    bits
      .match(/.{1,5}/g)
      ?.map((chunk) => alphabet[parseInt(chunk.padEnd(5, "0"), 2)])
      .join("") || ""
  );
};

const decodeBase32 = (key: string) => {
  const bits = key
    .split("")
    .map((char) => alphabet.indexOf(char).toString(2).padStart(5, "0"))
    .join("");
  return bits.match(/.{1,8}/g)?.map((byte) => parseInt(byte, 2)) || [];
};

export const deriveBase32Key = async (
  secretBase32: string,
  hexInput: string
): Promise<string> => {
  // Decode Base32 secret into bytes
  const secretBytes = decodeBase32(secretBase32.toUpperCase());

  // Convert hex string into bytes
  const txHashBytes = new Uint8Array(
    hexInput.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Import base key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(secretBytes),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Sign the txHash to derive K'
  const derived = await crypto.subtle.sign("HMAC", cryptoKey, txHashBytes);

  // Convert derived bits to Base32
  const derivedKeyBytes = new Uint8Array(derived);
  return encodeBase32(derivedKeyBytes).replace(/=/g, ""); // Remove padding
};
