import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

// use SHA3 to getting secret key for AES encrypt
const secretPhrase = `${process.env.TEST_SECRET_PHRASE}`;
const hash = CryptoJS.SHA3(secretPhrase, { outputLength: 256 });
const hashHex = hash.toString(CryptoJS.enc.Hex);

console.log("hash: ", hashHex);

const privateKey = `${process.env.TEST_PRIVATE_KEY}`;
const secretKey = hashHex;

// AES encrypt private key
const encrypted = CryptoJS.AES.encrypt(privateKey, secretKey).toString();

// AES decrypt private key
const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey);
const originalText = decrypted.toString(CryptoJS.enc.Utf8);

console.log("encrypted data: ", encrypted);
console.log("decrypted data: ", originalText);
