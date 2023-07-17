import { parseJWT } from "./parseJWT.js";

export function renderUserInfo() {
  const jwt = Cookies.get("JWT");
  const { name, public_address } = parseJWT(jwt);

  const headerWalletAddress = document.querySelector(".header-wallet-address");
  const sidebarUsername = document.querySelector(".sidebar-username");

  headerWalletAddress.textContent = public_address;
  sidebarUsername.textContent = name;
}
