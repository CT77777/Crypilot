import * as logOut from "./modules/logOut.js";
import { renderUserInfo } from "./modules/userInfo.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Buy";

const userId = Cookies.get("user_id");

const socket = io("wss://localhost:8080");
socket.on("connect", () => {
  console.log("browser client connect to socket server...");
});
socket.emit("join room", userId);
socket.on("buyEthStatus", (txResult) => {
  const { success, token, amount } = txResult;
  if (success) {
    // modalDialogContent.textContent = `Buy ${amount} ${token} successfully`;
    // triggerBtn.click();

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${1027}.png`,
      imageWidth: 36,
      iconUrl: "../images/check-mark.png",
      title: `Buy ${token} ${parseFloat(amount).toFixed(2)}`,
      titleSize: 18,
      message: "successfully",
      messageSize: 18,
      position: "topCenter",
      maxWidth: 500,
      timeout: 5000,
      pauseOnHover: true,
      drag: true,
      displayMode: 2,
    });
  } else {
    // modalDialogContent.textContent = `Buy ${amount} ${token} unsuccessfully`;
    // triggerBtn.click();

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${1027}.png`,
      imageWidth: 36,
      iconUrl: `../images/error.png`,
      title: `Buy ${token} ${amount}`,
      titleSize: 18,
      message: "unsuccessfully",
      messageSize: 18,
      position: "topCenter",
      maxWidth: 500,
      timeout: 5000,
      pauseOnHover: true,
      drag: true,
      displayMode: 2,
    });
  }
});

function addFiatCurrencySelection() {
  const fiatCurrency = document.querySelectorAll(".fiat-currency");
  const selectedFiatCurrency = document.querySelector(
    ".selected-fiat-currency"
  );

  fiatCurrency.forEach((element) => {
    element.addEventListener("click", (event) => {
      const dropdownItemAttributes =
        element.querySelector(".dropdown-item").classList;
      if (dropdownItemAttributes.contains("disabled")) {
        return;
      }

      const logo = element.querySelector(".currency-logo").getAttribute("src");
      const symbol = element.querySelector(".dropdown-item").textContent;

      const currencyHtml = `<img class="currency-logo" src="${logo}">${symbol}`;
      selectedFiatCurrency.innerHTML = currencyHtml;
    });
  });
}

function addTokenCurrencySelection() {
  const tokenCurrency = document.querySelectorAll(".token-currency");
  const selectedTokenCurrency = document.querySelector(
    ".selected-token-currency"
  );
  const contractAddress = document.querySelector(".contract-address");

  tokenCurrency.forEach((element) => {
    element.addEventListener("click", (event) => {
      const dropdownItemAttributes =
        element.querySelector(".dropdown-item").classList;
      if (dropdownItemAttributes.contains("disabled")) {
        return;
      }

      const logo = element.querySelector(".currency-logo").getAttribute("src");
      const symbol = element.querySelector(".dropdown-item").textContent;
      const contract = element
        .querySelector(".dropdown-item")
        .getAttribute("data-contract");

      const currencyHtml = `<img class="currency-logo" src="${logo}">${symbol}`;
      contractAddress.value = contract;
      selectedTokenCurrency.innerHTML = currencyHtml;
      console.log(contractAddress.value);
    });
  });
}

const buyByFiatBtn = document.querySelector(".buy-token-btn");
function addBuyingFunction() {
  // buyByFiatBtn.addEventListener("click", async () => {
  //   const jwt = Cookies.get("JWT");
  //   const tokenAddress = document.querySelector(".contract-address").value;
  //   const ethAmount = document.querySelector(".amount-token").value;
  //   const modalDialogContent = document.querySelector(".modal-body");
  //   const triggerBtn = document.querySelector(".trigger-btn");
  //   const response = await fetch("/trade/buy", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authentication: `Bearer ${jwt}`,
  //     },
  //     body: JSON.stringify({
  //       tokenAddress: tokenAddress,
  //       ethAmount: ethAmount,
  //     }),
  //   });
  //   const result = await response.json();
  //   if (result.txSending) {
  //     iziToast.show({
  //       theme: "dark",
  //       iconUrl: "../images/check-mark.png",
  //       title: "Send transaction",
  //       titleSize: 18,
  //       message: "successfully",
  //       messageSize: 18,
  //       position: "topCenter",
  //       maxWidth: 500,
  //       timeout: 3000,
  //       pauseOnHover: true,
  //       drag: true,
  //       displayMode: 2,
  //     });
  //   } else {
  //     console.log(result.error);
  //     iziToast.show({
  //       theme: "dark",
  //       iconUrl: "../images/error.png",
  //       title: "Send transaction",
  //       titleSize: 18,
  //       message: "unsuccessfully",
  //       messageSize: 18,
  //       position: "topCenter",
  //       maxWidth: 500,
  //       timeout: 3000,
  //       pauseOnHover: true,
  //       drag: true,
  //       displayMode: 2,
  //     });
  //   }
  // });
}

const fiatInput = document.querySelector(".amount-fiat");
const tokenInput = document.querySelector(".amount-token");
function addFiatConvert() {
  fiatInput.addEventListener("input", (event) => {
    const tokenPrice = 1980 * 30;
    const fiatValue = event.target.value;
    const tokenValue = fiatValue / tokenPrice;

    tokenInput.value = tokenValue;
  });
}

function addTokenConvert() {
  tokenInput.addEventListener("input", (event) => {
    const tokenPrice = 1980 * 30;
    const tokenValue = event.target.value;
    const fiatValue = tokenValue * tokenPrice;

    fiatInput.value = fiatValue;
  });
}

function main() {
  renderUserInfo();
  addFiatCurrencySelection();
  addTokenCurrencySelection();
  addBuyingFunction();
  addFiatConvert();
  addTokenConvert();
}

main();
