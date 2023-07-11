import speakeasy from "speakeasy";
import qrcode from "qrcode";

const secret = speakeasy.generateSecret({
  name: "WeAreDevs",
});

console.log(secret);

qrcode.toDataURL(secret.otpauth_url || "0", (error, data) => {
  console.log(data);
});
