import crypto from "node:crypto";

/**
 * License keys are encrypted at rest with AES-256-GCM. The 32-byte key comes from
 * KEY_ENCRYPTION_SECRET (base64). Generate one with: openssl rand -base64 32
 */
function getKey(): Buffer {
  const raw = process.env.KEY_ENCRYPTION_SECRET;
  if (!raw) {
    throw new Error(
      "KEY_ENCRYPTION_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env",
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(
      "KEY_ENCRYPTION_SECRET must decode to exactly 32 bytes. Generate one with `openssl rand -base64 32`",
    );
  }
  return key;
}

export type EncryptedSecret = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export function encryptSecret(plain: string): EncryptedSecret {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptSecret(secret: EncryptedSecret): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(secret.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(secret.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(secret.ciphertext, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/** Normalized sha256 of a key's plaintext, used to dedupe uploads. */
export function keyFingerprint(plain: string): string {
  return crypto
    .createHash("sha256")
    .update(plain.trim().toUpperCase())
    .digest("hex");
}
