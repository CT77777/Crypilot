import * as logOut from "./modules/logOut.js";

const walletAddress = document.querySelector(".wallet-address").textContent;

Cookies.set("wallet", walletAddress);
