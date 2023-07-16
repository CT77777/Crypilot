import * as logOut from "./modules/logOut.js";
import * as retrieveKey from "./modules/retrieveKey.js";
import * as secondFA from "./modules/2FA.js";
import * as logIn from "./modules/logIn.js";
import { renderUserInfo } from "./modules/userInfo.js";
import { parseJWT } from "./modules/parseJWT.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Buy";

const jwt = Cookies.get("JWT");
const { id: userId } = parseJWT(jwt);

const socket = io("wss://localhost:8080");
socket.on("connect", () => {
  console.log("browser client connect to socket server...");
});
socket.emit("join room", userId);
socket.on("buyEthStatus", (txResult) => {
  const { success, token, amount } = txResult;
  if (success) {
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
  const exchangeRate = document.querySelector(".exchange-rate");

  fiatCurrency.forEach((element) => {
    element.addEventListener("click", (event) => {
      const dropdownItemAttributes =
        element.querySelector(".dropdown-item").classList;
      if (dropdownItemAttributes.contains("disabled")) {
        return;
      }

      const logo = element.querySelector(".currency-logo").getAttribute("src");
      const symbol = element
        .querySelector(".dropdown-item")
        .querySelector("span").textContent;
      const rate = element
        .querySelector(".dropdown-item")
        .getAttribute("data-rate");

      exchangeRate.value = rate;
      const currencyHtml = `<img class="currency-logo" src="${logo}"><span>${symbol}</span>`;
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
      const symbol = element
        .querySelector(".dropdown-item")
        .querySelector("span").textContent;
      const contract = element
        .querySelector(".dropdown-item")
        .getAttribute("data-contract");

      contractAddress.value = contract;
      const currencyHtml = `<img class="currency-logo" src="${logo}"><span>${symbol}</span>`;
      selectedTokenCurrency.innerHTML = currencyHtml;
    });
  });
}

function addFiatInputEvent() {
  const fiatInput = document.querySelector(".amount-fiat");
  const tokenInput = document.querySelector(".amount-token");

  fiatInput.addEventListener("input", async (event) => {
    const tokenIn = document.querySelector(".contract-address").value;
    const tokenInSymbolContainer = document
      .querySelector(".selected-token-currency")
      .querySelector("span");

    const fiatExchangeRate = document.querySelector(".exchange-rate").value;
    const fiatSymbolContainer = document
      .querySelector(".selected-fiat-currency")
      .querySelector("span");

    if (
      tokenIn === "" ||
      tokenInSymbolContainer === null ||
      fiatExchangeRate === "" ||
      fiatSymbolContainer === null
    ) {
      return;
    }

    tokenInput.setAttribute("disabled", "true");
    document.querySelector(".spinner-token").style.display = "block";
    document.querySelector(".label-token").style.display = "none";

    const tokenInSymbol = tokenInSymbolContainer.textContent;
    const tokenOut = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const tokenOutSymbol = "USDT";
    const amountIn = "1";

    const response = await fetch("/trade/quote/exact/input", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tokenIn,
        tokenInSymbol,
        amountIn,
        tokenOut,
        tokenOutSymbol,
      }),
    });

    const results = await response.json();

    const { amountOut, estimateGasFee } = results.data;

    const tokenPrice = amountOut * fiatExchangeRate;
    const fiatValue = event.target.value;
    const tokenValue = fiatValue / tokenPrice;

    tokenInput.value = tokenValue;

    tokenInput.removeAttribute("disabled");
    document.querySelector(".spinner-token").style.display = "none";
    document.querySelector(".label-token").style.display = "block";
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

    const tokenIn = document.querySelector(".contract-address").value;
    const tokenInSymbolContainer = document
      .querySelector(".selected-token-currency")
      .querySelector("span");

    const fiatExchangeRate = document.querySelector(".exchange-rate").value;
    const fiatSymbolContainer = document
      .querySelector(".selected-fiat-currency")
      .querySelector("span");

    if (
      tokenIn === "" ||
      tokenInSymbolContainer === null ||
      fiatExchangeRate === "" ||
      fiatSymbolContainer === null
    ) {
      event.preventDefault();

      iziToast.show({
        theme: "dark",
        iconUrl: "../images/error.png",
        title: "Select fiat currency and crypto",
        titleSize: 18,
        messageSize: 18,
        position: "topCenter",
        maxWidth: 500,
        timeout: 3000,
        pauseOnHover: true,
        drag: true,
        displayMode: 2,
      });
    }
  });
}

function addTokenInputEvent() {
  const fiatInput = document.querySelector(".amount-fiat");
  const tokenInput = document.querySelector(".amount-token");

  tokenInput.addEventListener("input", async (event) => {
    const tokenIn = document.querySelector(".contract-address").value;
    const tokenInSymbolContainer = document
      .querySelector(".selected-token-currency")
      .querySelector("span");

    const fiatExchangeRate = document.querySelector(".exchange-rate").value;
    const fiatSymbolContainer = document
      .querySelector(".selected-fiat-currency")
      .querySelector("span");

    if (
      tokenIn === "" ||
      tokenInSymbolContainer === null ||
      fiatExchangeRate === "" ||
      fiatSymbolContainer === null
    ) {
      return;
    }

    fiatInput.setAttribute("disabled", "true");
    document.querySelector(".spinner-fiat").style.display = "block";
    document.querySelector(".label-fiat").style.display = "none";

    const tokenInSymbol = tokenInSymbolContainer.textContent;
    const tokenOut = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const tokenOutSymbol = "USDT";
    const amountIn = "1";

    const response = await fetch("/trade/quote/exact/input", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tokenIn,
        tokenInSymbol,
        amountIn,
        tokenOut,
        tokenOutSymbol,
      }),
    });

    const results = await response.json();

    const { amountOut, estimateGasFee } = results.data;

    const tokenPrice = amountOut * fiatExchangeRate;
    const tokenValue = event.target.value;
    const fiatValue = tokenValue * tokenPrice;

    fiatInput.value = fiatValue;

    fiatInput.removeAttribute("disabled");
    document.querySelector(".spinner-fiat").style.display = "none";
    document.querySelector(".label-fiat").style.display = "block";
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

    const tokenIn = document.querySelector(".contract-address").value;
    const tokenInSymbolContainer = document
      .querySelector(".selected-token-currency")
      .querySelector("span");

    const fiatExchangeRate = document.querySelector(".exchange-rate").value;
    const fiatSymbolContainer = document
      .querySelector(".selected-fiat-currency")
      .querySelector("span");

    if (
      tokenIn === "" ||
      tokenInSymbolContainer === null ||
      fiatExchangeRate === "" ||
      fiatSymbolContainer === null
    ) {
      event.preventDefault();

      iziToast.show({
        theme: "dark",
        iconUrl: "../images/error.png",
        title: "Select fiat currency and crypto",
        titleSize: 18,
        messageSize: 18,
        position: "topCenter",
        maxWidth: 500,
        timeout: 3000,
        pauseOnHover: true,
        drag: true,
        displayMode: 2,
      });
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
