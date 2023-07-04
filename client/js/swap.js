import * as logOut from "./modules/logOut.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Swap";

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
              <a class="dropdown-item" href="#" data-contract="${ftList[key].token_address}">
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

      const currencyHtml = `<img class="currency-logo" src="${logo}">${symbol}`;
      contractAddress.value = contract;
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

    //currency-out origin
    const currencyOutContainer = document.querySelector(
      ".container-currency-out"
    );
    const currencyOutContainerOrigin = currencyOutContainer.innerHTML;
    const amountOutOrigin =
      currencyOutContainer.querySelector(".amount-token").value;
    const contractAddressOutOrigin =
      currencyOutContainer.querySelector(".contract-address").value;

    //currency-in replace with currency-out origin
    currencyInContainer.innerHTML = currencyOutContainerOrigin;
    currencyInContainer.querySelector(".amount-token").value = amountOutOrigin;
    currencyInContainer.querySelector(".contract-address").value =
      contractAddressOutOrigin;

    //currency-out replace with currency-in origin
    currencyOutContainer.innerHTML = currencyInContainerOrigin;
    currencyOutContainer.querySelector(".amount-token").value = amountInOrigin;
    currencyOutContainer.querySelector(".contract-address").value =
      contractAddressInOrigin;

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

    const tokensAddress = document
      .querySelector(".tokens-form")
      .querySelector(".contract-address").value;
    const tokensAmount = document
      .querySelector(".tokens-form")
      .querySelector(".amount-token").value;

    const modalDialogContent = document.querySelector(".modal-body");
    const triggerBtn = document.querySelector(".trigger-btn");

    const currencyInContainer = document.querySelector(
      ".container-currency-in"
    );
    const isBuyTokens = currencyInContainer
      .querySelector(".form-floating")
      .classList.contains("token-currency-form");

    if (isBuyTokens) {
      console.log("buy");
      const response = await fetch("/trade/swap/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tokenAddress: tokensAddress,
          tokenAmount: tokensAmount,
        }),
      });

      console.log(tokensAddress);

      const result = await response.json();
      modalDialogContent.textContent = `Buy successfully! token amount ${result.tokenAmount}`;

      triggerBtn.click();
    } else {
      console.log("sell");
      const response = await fetch("/trade/swap/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tokenAddress: tokensAddress,
          tokenAmount: tokensAmount,
        }),
      });

      console.log(tokensAddress);

      const result = await response.json();
      modalDialogContent.textContent = `Sell successfully! token amount ${result.tokenAmount}`;

      triggerBtn.click();
    }
  });
}

async function main() {
  await renderSwapTokens();
  addTokenCurrencySelection();
  addTokensSelection();
  addTokenCurrencyConvert();
  addTokensConvert();
  addSwitchFunction();
  addSwapFunction();
}

main();
