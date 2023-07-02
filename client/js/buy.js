import * as logOut from "./modules/logOut.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Buy";

function addCurrencySelection() {
  const currency = document.querySelectorAll(".currency");
  const selectedCurrency = document.querySelector(".selected-currency");
  const contractAddress = document.querySelector(".contract-address");

  currency.forEach((element) => {
    element.addEventListener("click", (event) => {
      const logo = element.querySelector(".currency-logo").getAttribute("src");
      const symbol = element.querySelector(".dropdown-item").textContent;
      const contract = element
        .querySelector(".dropdown-item")
        .getAttribute("data-contract");

      const currencyHtml = `<img class="currency-logo" src="${logo}">${symbol}`;
      contractAddress.value = contract;
      selectedCurrency.innerHTML = currencyHtml;
      console.log(contractAddress.value);
    });
  });
}

const buyByFiatBtn = document.querySelector(".buy-fiat-btn");
function addBuyingFunction() {
  buyByFiatBtn.addEventListener("click", async () => {
    const jwt = Cookies.get("JWT");
    const tokenAddress = document.querySelector(".contract-address").value;
    const ethAmount = document.querySelector(".amount-buy").value;

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

function main() {
  addCurrencySelection();
  addBuyingFunction();
}

main();
