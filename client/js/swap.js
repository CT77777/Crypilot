import * as logOut from "./modules/logOut.js";
import { renderUserInfo } from "./modules/userInfo.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Swap";

const userId = Cookies.get("user_id");

const socket = io("wss://localhost:8080");
socket.on("connect", () => {
  console.log("browser client connect to socket server...");
});
socket.emit("join room", userId);
socket.on("swapEthToStatus", (txResult) => {
  const { success, token, amount, id } = txResult;
  if (success) {
    // alert(`buy ${amount} ${token} successfully`);

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`,
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
    // alert(`buy ${amount} ${token} unsuccessfully`);

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`,
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
socket.on("swapTokenToStatus", (txResult) => {
  const { success, token, amount, id } = txResult;
  if (success) {
    // alert(`sell ${amount} ${token} successfully`);

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`,
      imageWidth: 36,
      iconUrl: "../images/check-mark.png",
      title: `Sell ${token} ${parseFloat(amount).toFixed(2)}`,
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
    // alert(`sell ${amount} ${token} unsuccessfully`);

    iziToast.show({
      theme: "dark",
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`,
      imageWidth: 36,
      iconUrl: `../images/error.png`,
      title: `Sell ${token} ${amount}`,
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

async function renderSwapTokens() {
  const response = await fetch("/market/ft/list");
  const results = await response.json();
  const { ftList } = results;
  console.log(ftList);
  const dropDownMenu = document.querySelector(".dropdown-menu-tokens");

  for (let key in ftList) {
    if (
      ftList[key].symbol !== "ETH" &&
      ftList[key].symbol !== "USDT" &&
      ftList[key].symbol !== "USDC" &&
      ftList[key].symbol !== "WBTC"
    ) {
      const currencyHtml = `
            <li class="tokens">
              <a class="dropdown-item" data-id="${ftList[key].id}" data-contract="${ftList[key].token_address}">
                  <img class="currency-logo"
                      src="${ftList[key].logo}">${ftList[key].symbol}
              </a>
            </li>
            <li>
                <hr class="dropdown-divider">
            </li>
            `;
      dropDownMenu.insertAdjacentHTML("afterbegin", currencyHtml);
    }
  }
  dropDownMenu.removeChild(dropDownMenu.lastElementChild);
}

function addTokenCurrencySelection() {
  const tokenCurrency = document.querySelectorAll(".token-currency");
  const selectedTokenCurrency = document.querySelector(
    ".selected-token-currency"
  );
  const contractAddress = document.querySelector(
    ".contract-address-token-currency"
  );

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

function addTokensSelection() {
  const tokens = document.querySelectorAll(".tokens");
  const selectedTokens = document.querySelector(".selected-tokens");
  const contractAddress = document.querySelector(".contract-address-tokens");
  const cmcId = document.querySelector(".cmc-id-tokens");

  tokens.forEach((element) => {
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
      const cmc_id = element
        .querySelector(".dropdown-item")
        .getAttribute("data-id");

      const currencyHtml = `<img class="currency-logo" src="${logo}">${symbol}`;
      contractAddress.value = contract;
      cmcId.value = cmc_id;
      selectedTokens.innerHTML = currencyHtml;
      console.log(contractAddress.value);
    });
  });
}

function addTokenCurrencyConvert() {
  const tokenCurrencyInput = document
    .querySelector(".token-currency-form")
    .querySelector(".amount-token");
  const tokensInput = document
    .querySelector(".tokens-form")
    .querySelector(".amount-token");
  tokenCurrencyInput.addEventListener("input", (event) => {
    const tokenCurrencyPrice = 1980;
    const tokensPrice = 40;
    const tokenCurrencyAmount = event.target.value;
    const tokensAmount =
      (tokenCurrencyAmount * tokenCurrencyPrice) / tokensPrice;

    tokensInput.value = tokensAmount;
  });
}

function addTokensConvert() {
  const tokenCurrencyInput = document
    .querySelector(".token-currency-form")
    .querySelector(".amount-token");
  const tokensInput = document
    .querySelector(".tokens-form")
    .querySelector(".amount-token");
  tokensInput.addEventListener("input", (event) => {
    const tokenCurrencyPrice = 1980;
    const tokensPrice = 40;
    const tokensAmount = event.target.value;
    const tokenCurrencyAmount =
      (tokensAmount * tokensPrice) / tokenCurrencyPrice;

    tokenCurrencyInput.value = tokenCurrencyAmount;
  });
}

function addSwitchFunction() {
  const switchBtn = document.querySelector(".switch-btn-hover");

  switchBtn.addEventListener("click", () => {
    console.log("switch");

    //currency-in origin
    const currencyInContainer = document.querySelector(
      ".container-currency-in"
    );
    const currencyInContainerOrigin = currencyInContainer.innerHTML;
    const amountInOrigin =
      currencyInContainer.querySelector(".amount-token").value;
    const contractAddressInOrigin =
      currencyInContainer.querySelector(".contract-address").value;
    const tokenCmcIdInOrigin =
      currencyInContainer.querySelector(".cmc-id").value;

    //currency-out origin
    const currencyOutContainer = document.querySelector(
      ".container-currency-out"
    );
    const currencyOutContainerOrigin = currencyOutContainer.innerHTML;
    const amountOutOrigin =
      currencyOutContainer.querySelector(".amount-token").value;
    const contractAddressOutOrigin =
      currencyOutContainer.querySelector(".contract-address").value;
    const tokenCmcIdOutOrigin =
      currencyOutContainer.querySelector(".cmc-id").value;

    //currency-in replace with currency-out origin
    currencyInContainer.innerHTML = currencyOutContainerOrigin;
    currencyInContainer.querySelector(".amount-token").value = amountOutOrigin;
    currencyInContainer.querySelector(".contract-address").value =
      contractAddressOutOrigin;
    currencyInContainer.querySelector(".cmc-id").value = tokenCmcIdOutOrigin;

    //currency-out replace with currency-in origin
    currencyOutContainer.innerHTML = currencyInContainerOrigin;
    currencyOutContainer.querySelector(".amount-token").value = amountInOrigin;
    currencyOutContainer.querySelector(".contract-address").value =
      contractAddressInOrigin;
    currencyOutContainer.querySelector(".cmc-id").value = tokenCmcIdInOrigin;

    //refresh swap button
    const swapBtnContainer = document.querySelector(".container-btn-swap");
    const swapBtnContainerOrigin = swapBtnContainer.innerHTML;
    swapBtnContainer.innerHTML = swapBtnContainerOrigin;

    addTokenCurrencySelection();
    addTokensSelection();

    addTokenCurrencyConvert();
    addTokensConvert();

    addSwapFunction();
  });
}

function addSwapFunction() {
  const swapButton = document.querySelector(".btn-swap");

  swapButton.addEventListener("click", async () => {
    const jwt = Cookies.get("JWT");

    const tokenAddress = document
      .querySelector(".tokens-form")
      .querySelector(".contract-address").value;
    const tokenAmount = document
      .querySelector(".tokens-form")
      .querySelector(".amount-token").value;
    const tokenSymbol = document
      .querySelector(".selected-tokens")
      .textContent.trim();
    const tokenCmcId = document
      .querySelector(".tokens-form")
      .querySelector(".cmc-id").value;

    console.log(tokenCmcId);

    const modalDialogContent = document.querySelector(".modal-body");
    const triggerBtn = document.querySelector(".trigger-btn");

    const currencyInContainer = document.querySelector(
      ".container-currency-in"
    );
    const isBuyTokens = currencyInContainer
      .querySelector(".form-floating")
      .classList.contains("token-currency-form");

    if (isBuyTokens) {
      console.log("buy", tokenSymbol, tokenAddress, tokenCmcId);
      const response = await fetch("/trade/swap/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tokenAddress,
          tokenAmount,
          tokenSymbol,
          tokenCmcId,
        }),
      });

      const result = await response.json();

      if (result.txSending) {
        // modalDialogContent.textContent = `Send transaction successfully`;

        iziToast.show({
          theme: "dark",
          iconUrl: "../images/check-mark.png",
          title: "Send transaction",
          titleSize: 18,
          message: "successfully",
          messageSize: 18,
          position: "topCenter",
          maxWidth: 500,
          timeout: 3000,
          pauseOnHover: true,
          drag: true,
          displayMode: 2,
        });
      } else {
        // modalDialogContent.textContent = `Send transaction unsuccessfully`;

        console.log(result.error);

        iziToast.show({
          theme: "dark",
          iconUrl: "../images/error.png",
          title: "Send transaction",
          titleSize: 18,
          message: "unsuccessfully",
          messageSize: 18,
          position: "topCenter",
          maxWidth: 500,
          timeout: 3000,
          pauseOnHover: true,
          drag: true,
          displayMode: 2,
        });
      }

      // triggerBtn.click();
    } else {
      console.log("sell", tokenSymbol, tokenAddress, tokenCmcId);

      const response = await fetch("/trade/swap/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tokenAddress,
          tokenAmount,
          tokenSymbol,
          tokenCmcId,
        }),
      });
      const result = await response.json();

      if (result.txSending) {
        // modalDialogContent.textContent = `Send transaction successfully`;

        iziToast.show({
          theme: "dark",
          iconUrl: "../images/check-mark.png",
          title: "Send transaction",
          titleSize: 18,
          message: "successfully",
          messageSize: 18,
          position: "topCenter",
          maxWidth: 500,
          timeout: 3000,
          pauseOnHover: true,
          drag: true,
          displayMode: 2,
        });
      } else {
        // modalDialogContent.textContent = `Send transaction unsuccessfully`;

        console.log(result.error);

        iziToast.show({
          theme: "dark",
          iconUrl: "../images/error.png",
          title: "Send transaction",
          titleSize: 18,
          message: "unsuccessfully",
          messageSize: 18,
          position: "topCenter",
          maxWidth: 500,
          timeout: 3000,
          pauseOnHover: true,
          drag: true,
          displayMode: 2,
        });
      }

      // triggerBtn.click();
    }
  });
}

async function main() {
  renderUserInfo();
  await renderSwapTokens();
  addTokenCurrencySelection();
  addTokensSelection();
  addTokenCurrencyConvert();
  addTokensConvert();
  addSwitchFunction();
  addSwapFunction();
}

main();
