import * as jose from "jose";
import dotenv from "dotenv";

dotenv.config();

export async function createJWT(
  provider: string,
  id: number,
  email: string,
  name: string,
  picture: string,
  public_address: string
) {
  const secret_key = process.env.JWT_SECRET_KEY;
  const secret = new TextEncoder().encode(secret_key);
  const header = { alg: "HS256", typ: "JWT" };
  const jwt = await new jose.SignJWT({
    role: "user",
    provider: provider,
    id: id,
    email: email,
    name: name,
    picture: picture,
    public_address: public_address,
  })
    .setProtectedHeader(header)
    .setIssuedAt()
    .setIssuer("localhost")
    .setAudience("http://localhost/user/profile")
    .setExpirationTime("2h")
    .sign(secret);

  const access_expired = 7200;

  return { jwt, access_expired };
}

export async function verifyJWT(jwt: string) {
  try {
    const secret_key = process.env.JWT_SECRET_KEY;
    const secret = new TextEncoder().encode(secret_key);
    const { payload } = await jose.jwtVerify(jwt, secret, {
      issuer: "localhost",
      audience: "http://localhost/user/profile",
    });
    return payload;
  } catch (error) {
    console.log(error);
    throw new Error("Verify JWT failed");
  }
}
