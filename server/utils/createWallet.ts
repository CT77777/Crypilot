import Wallet from "ethereumjs-wallet";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

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

export function decrypt(encrypted_private_key: string) {
  // use SHA3 to getting secret key for AES encrypt
  const secretPhrase = `${process.env.TEST_SECRET_PHRASE}`;
  const hash = CryptoJS.SHA3(secretPhrase, { outputLength: 256 });
  const hashHex = hash.toString(CryptoJS.enc.Hex);

  const encryptedPrivateKey = encrypted_private_key;
  const secretKey = hashHex;

  const decrypted = CryptoJS.AES.decrypt(encryptedPrivateKey, secretKey);
  const originalText = decrypted.toString(CryptoJS.enc.Utf8);

  console.log("decrypted data: ", originalText);

  return originalText;
}
