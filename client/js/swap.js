import * as logOut from "./modules/logOut.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Swap";

async function renderSwapTokens() {
  const response = await fetch("/market/ft/list");
  const results = await response.json();
  console.log(results);
  const { ftList } = results;
  console.log(ftList);
  const dropDownMenu = document.querySelector(".dropdown-menu-tokens");

  console.log(dropDownMenu);

  for (let key in ftList) {
    if (
      ftList[key].symbol !== "ETH" &&
      ftList[key].symbol !== "USDT" &&
      ftList[key].symbol !== "USDC" &&
      ftList[key].symbol !== "WBTC"
    ) {
      const currencyHtml = `
            <li class="currency">
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
  console.log(dropDownMenu);
}

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

function addBuySellFunction() {
  const buyButton = document.querySelector(".btn-buy");
  const sellButton = document.querySelector(".btn-sell");

  buyButton.addEventListener("click", async () => {
    const jwt = Cookies.get("JWT");
    const tokenAddress = document.querySelector(".contract-address").value;
    const tokenAmount = document.querySelector(".amount-swap").value;
    const modalDialogContent = document.querySelector(".modal-body");
    const triggerBtn = document.querySelector(".trigger-btn");

    const response = await fetch("/trade/swap/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        tokenAmount: tokenAmount,
      }),
    });
    const result = await response.json();
    modalDialogContent.textContent = `Buy successfully! token amount ${result.tokenAmount}`;

    triggerBtn.click();
  });

  sellButton.addEventListener("click", async () => {
    const jwt = Cookies.get("JWT");
    const tokenAddress = document.querySelector(".contract-address").value;
    const tokenAmount = document.querySelector(".amount-swap").value;
    const modalDialogContent = document.querySelector(".modal-body");
    const triggerBtn = document.querySelector(".trigger-btn");

    const response = await fetch("/trade/swap/sell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        tokenAmount: tokenAmount,
      }),
    });
    const result = await response.json();
    modalDialogContent.textContent = `Sell successfully! token amount ${result.tokenAmount}`;

    triggerBtn.click();
  });
}

async function main() {
  await renderSwapTokens();
  addCurrencySelection();
  addBuySellFunction();
}

main();
