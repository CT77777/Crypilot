const userInfo = JSON.parse(localStorage.getItem("userInfo"));

export function renderUserInfo() {
  const { name, public_address } = userInfo;

  const headerWalletAddress = document.querySelector(".header-wallet-address");
  const sidebarUsername = document.querySelector(".sidebar-username");

  headerWalletAddress.textContent = public_address;
  sidebarUsername.textContent = name;
}
