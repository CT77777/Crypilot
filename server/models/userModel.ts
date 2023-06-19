import dbPool from "./dbPool.js";
import { OkPacket, RowDataPacket, FieldPacket } from "mysql2";
import Wallet from "ethereumjs-wallet";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export async function insertUser(
  email: string,
  password: string,
  name: string,
  picture: string
) {
  const results: [OkPacket, FieldPacket[]] = await dbPool.query(
    `
        INSERT INTO users (email, password, name, picture)
        VALUES (?, ?, ?, ?)
    `,
    [email, password, name, picture]
  );
  const user_id = results[0].insertId;
  return user_id;
}

export async function insetProvider(user_id: number, name: string) {
  await dbPool.query(
    `
        INSERT INTO user_providers (user_id, name)
        VALUES (?, ?)
    `,
    [user_id, name]
  );
}

export async function insertWallet(
  user_id: number,
  public_address: string,
  private_key: string
) {
  await dbPool.query(
    `
        INSERT INTO user_wallets (user_id, public_address, private_key)
        VALUES (?, ?, ?)
    `,
    [user_id, public_address, private_key]
  );
}

export function createWallet() {
  // create private and public key pair
  const wallet = Wallet.default.generate();

  // get private key
  const privateKey = wallet.getPrivateKeyString();

  // get public key
  const publicKey = wallet.getPublicKeyString();

  // get public address derived from public key
  const publicAddress = wallet.getAddressString();

  console.log({
    private_key: privateKey,
    public_key: publicKey,
    public_address: publicAddress,
  });

  return { privateKey, publicAddress };
}

export function encrypt(private_key: string) {
  // use SHA3 to getting secret key for AES encrypt
  const secretPhrase = `${process.env.TEST_SECRET_PHRASE}`;
  const hash = CryptoJS.SHA3(secretPhrase, { outputLength: 256 });
  const hashHex = hash.toString(CryptoJS.enc.Hex);

  console.log("hash: ", hashHex);

  const privateKey = private_key;
  const secretKey = hashHex;

  // AES encrypt private key
  const encrypted = CryptoJS.AES.encrypt(privateKey, secretKey).toString();

  console.log("encrypted data: ", encrypted);

  return encrypted;
}

export async function searchUserByEmail(email: string) {
  const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
        SELECT password, name, picture, public_address FROM users
        INNER JOIN user_wallets
        ON users.id = user_wallets.user_id
        WHERE email = ?
    `,
    [email]
  );

  return results[0][0];
}
