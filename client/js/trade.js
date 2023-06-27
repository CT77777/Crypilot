// table selection
const tableSelections = document.querySelector(".table-selections");
const tableSelectionAll = document.querySelectorAll(".table-selection");

tableSelections.addEventListener("click", (event) => {
  const target = event.target;
  tableSelectionAll.forEach((element) => {
    element.removeAttribute("data-state");
  });
  target.setAttribute("data-state", "true");
});

const contentContainerMain = document.querySelector(".content-container-main");

function renderBuyForm() {
  const swapForm = document.querySelector(".swap-form");
  const buyForm = document.querySelector(".buy-form");

  if (swapForm) {
    contentContainerMain.removeChild(swapForm);
  }
  if (buyForm) {
    contentContainerMain.removeChild(buyForm);
  }

  const buyFormHTML = `
  <form class="buy-form" action="/trade/buy" method="POST">
    <div class="btn-group">
        <button class="btn btn-secondary btn-lg selected-currency" type="button">
            Select a currency
        </button>
        <button type="button" class="btn btn-lg btn-secondary dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
            <li class="currency">
                <a class="dropdown-item" href="#" data-contract="">
                    <img class="currency-logo"
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png">ETH
                </a>
            </li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li class="currency">
                <a class="dropdown-item" href="#"
                    data-contract="0x6b175474e89094c44da98b954eedeac495271d0f">
                    <img class="currency-logo"
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png">DAI
                </a>
            </li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li class="currency">
                <a class="dropdown-item" href="#"
                    data-contract="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">
                    <img class="currency-logo"
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png">USDC
                </a>
            </li>
        </ul>
    </div>
    <div class="form-floating">
        <input class="contract-address" type="text" name="tokenAddress" style="display: none">
        <input type="number" step="0.01" name="ethAmount" class="form-control" id="floatingEthAmount"
            placeholder="ETH amount" required>
        <label for="floatingEthAmount">Amount</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">Buy</button>
  </form>
    `;
  contentContainerMain.insertAdjacentHTML("beforeend", buyFormHTML);

  addCurrencySelection();
}

async function renderSwapForm() {
  const buyForm = document.querySelector(".buy-form");
  const swapForm = document.querySelector(".swap-form");

  if (buyForm) {
    contentContainerMain.removeChild(buyForm);
  }

  if (swapForm) {
    contentContainerMain.removeChild(swapForm);
  }

  const swapFormHTML = `
    <form class="swap-form" action="/trade/swap/buy" method="POST">
        <div class="btn-group">
          <button class="btn btn-secondary btn-lg selected-currency" type="button">
              Select a currency
          </button>
          <button type="button" class="btn btn-lg btn-secondary dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown" aria-expanded="false">
              <span class="visually-hidden">Toggle Dropdown</span>
          </button>
          <ul class="dropdown-menu">
          </ul>
        </div>
        <div class="form-floating">
            <input class="contract-address" type="text" name="tokenAddress" style="display: none">
            <input type="number" step="0.01" name="tokenAmount" class="form-control" id="floatingPassword"
                placeholder="token amount" required>
            <label for="floatingPassword">Token amount</label>
        </div>
        <button class="btn btn-primary w-100 py-2 btn-buy" type="button">Buy</button>
        <button class="btn btn-primary w-100 py-2 btn-sell" type="button">Sell</button>
    </form>
    `;
  contentContainerMain.insertAdjacentHTML("beforeend", swapFormHTML);

  const response = await fetch("/market/ft/list");
  const results = await response.json();
  console.log(results);
  const { ftList } = results;

  const dropDownMenu = document.querySelector(".dropdown-menu");
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

  addCurrencySelection();

  const buyButton = document.querySelector(".btn-buy");
  const sellButton = document.querySelector(".btn-sell");

  buyButton.addEventListener("click", () => {
    const swapForm = document.querySelector(".swap-form");
    swapForm.setAttribute("action", "/trade/swap/buy");
    swapForm.submit();
  });
  sellButton.addEventListener("click", () => {
    const swapForm = document.querySelector(".swap-form");
    swapForm.setAttribute("action", "/trade/swap/sell");
    swapForm.submit();
  });
}

// select buy / swap table
const tableBuy = document.querySelector(".table-buy");
const tableSwap = document.querySelector(".table-swap");

tableBuy.addEventListener("click", () => {
  renderBuyForm();
});
tableSwap.addEventListener("click", () => {
  renderSwapForm();
});

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

addCurrencySelection();
