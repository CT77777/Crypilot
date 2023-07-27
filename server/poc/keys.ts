import Wallet from "ethereumjs-wallet";

// create private and public key pair
const wallet = Wallet.default.generate();

// get private key
const privateKey = wallet.getPrivateKeyString();

// get public key
const publicKey = wallet.getPublicKeyString();

// get public address derived from public key
const publicAddress = wallet.getAddressString();

console.log("private key: ", privateKey);
console.log("public key: ", publicKey);
console.log("public address: ", publicAddress);
