export function renderHeaderWalletAddress() {
  const headerWalletAddress = document.querySelector(".header-wallet-address");
  const userWalletAddress = Cookies.get("wallet");

  headerWalletAddress.textContent = userWalletAddress;
}
