import * as logOut from "./modules/logOut.js";
import { renderUserInfo } from "./modules/userInfo.js";
import * as retrieveKey from "./modules/retrieveKey.js";

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

function addFiatInputEvent() {
  const fiatInput = document.querySelector(".amount-fiat");
  const tokenInput = document.querySelector(".amount-token");

  fiatInput.addEventListener("input", (event) => {
    const tokenPrice = 1980 * 30;
    const fiatValue = event.target.value;
    const tokenValue = fiatValue / tokenPrice;

    tokenInput.value = tokenValue;
  });

  fiatInput.addEventListener("keydown", (event) => {
    if (
      event.key === "e" ||
      event.key === "E" ||
      event.key === "+" ||
      event.key === "-"
    ) {
      event.preventDefault();
    }
  });
}

function addTokenInputEvent() {
  const fiatInput = document.querySelector(".amount-fiat");
  const tokenInput = document.querySelector(".amount-token");

  tokenInput.addEventListener("input", (event) => {
    const tokenPrice = 1980 * 30;
    const tokenValue = event.target.value;
    const fiatValue = tokenValue * tokenPrice;

    fiatInput.value = fiatValue;
  });

  tokenInput.addEventListener("keydown", (event) => {
    if (
      event.key === "e" ||
      event.key === "E" ||
      event.key === "+" ||
      event.key === "-"
    ) {
      event.preventDefault();
    }
  });
}

function main() {
  renderUserInfo();
  addFiatCurrencySelection();
  addTokenCurrencySelection();
  addFiatInputEvent();
  addTokenInputEvent();
}

main();
