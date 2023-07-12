import speakeasy, {
  GeneratedSecret,
  Encoding,
  TotpVerifyOptions,
} from "speakeasy";
import qrcode from "qrcode";

export function generateSecret() {
  const secret = speakeasy.generateSecret({
    name: "Crypilot",
  });

  return secret;
}

export async function generateQRcode(secret: GeneratedSecret) {
  const qrCode = await qrcode.toDataURL(secret.otpauth_url || "0");

  return qrCode;
}

export async function verifyToken(
  secretOption: TotpVerifyOptions["secret"],
  encodingOption: Encoding,
  token: TotpVerifyOptions["token"]
) {
  const isVerified = speakeasy.totp.verify({
    secret: secretOption,
    encoding: encodingOption,
    token: token,
  });

  return isVerified;
}
