import speakeasy from "speakeasy";

const verified = speakeasy.totp.verify({
  secret: ")V1U)S;w?yi?3@OdanuioI!NPsTps/>A",
  encoding: "ascii",
  token: "104426",
});

console.log(verified);
