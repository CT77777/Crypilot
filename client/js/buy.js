import * as logOut from "./modules/logOut.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Buy";

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
  buyByFiatBtn.addEventListener("click", async () => {
    const jwt = Cookies.get("JWT");
    const tokenAddress = document.querySelector(".contract-address").value;
    const ethAmount = document.querySelector(".amount-token").value;

    const modalDialogContent = document.querySelector(".modal-body");
    const triggerBtn = document.querySelector(".trigger-btn");

    const response = await fetch("/trade/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        ethAmount: ethAmount,
      }),
    });
    const result = await response.json();
    modalDialogContent.textContent = `Buy successfully! ETH amount ${result.ethAmount}`;

    triggerBtn.click();
  });
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
  addFiatCurrencySelection();
  addTokenCurrencySelection();
  addBuyingFunction();
  addFiatConvert();
  addTokenConvert();
}

main();
