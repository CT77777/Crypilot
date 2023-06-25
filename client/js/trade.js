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
        <div class="form-floating">
            <input type="number" step="0.01" name="ethAmount" class="form-control" id="floatingEthAmount"
                placeholder="ETH amount" required>
            <label for="floatingEthAmount">ETH amount</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Buy</button>
    </form>
    `;
  contentContainerMain.insertAdjacentHTML("beforeend", buyFormHTML);
}

function renderSwapForm() {
  const buyForm = document.querySelector(".buy-form");
  const swapForm = document.querySelector(".swap-form");

  if (buyForm) {
    contentContainerMain.removeChild(buyForm);
  }

  if (swapForm) {
    contentContainerMain.removeChild(swapForm);
  }

  const swapFormHTML = `
    <form class="swap-form" action="/trade/swap" method="POST">
        <div class="form-floating">
            <input type="text" name="tokenAddress" class="form-control" id="floatingInput"
                placeholder="0x......" required>
            <label for="floatingInput">Token address</label>
        </div>
        <div class="form-floating">
            <input type="number" step="0.01" name="tokenAmount" class="form-control" id="floatingPassword"
                placeholder="token amount" required>
            <label for="floatingPassword">Token amount</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Swap</button>
    </form>
    `;
  contentContainerMain.insertAdjacentHTML("beforeend", swapFormHTML);
}

const tableBuy = document.querySelector(".table-buy");
const tableSwap = document.querySelector(".table-swap");

tableBuy.addEventListener("click", () => {
  renderBuyForm();
});
tableSwap.addEventListener("click", () => {
  renderSwapForm();
});
