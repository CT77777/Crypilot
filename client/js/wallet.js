import * as logOut from "./modules/logOut.js";
import { renderUserInfo } from "./modules/userInfo.js";
import * as retrieveKey from "./modules/retrieveKey.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Wallet";

const inventoryListTitles = document.querySelector(".inventory-list-titles");
const inventoryLists = document.querySelector(".inventory-lists");

async function getInventoryFts() {
  const response = await fetch("/wallet/fts");
  const results = await response.json();
  const { userFtsBalance } = results;

  return userFtsBalance;
}

async function renderInventory() {
  const userFtsBalance = await getInventoryFts();

  inventoryListTitles.innerHTML = `
    <tr>
        <th scope="col">Logo</th>
        <th scope="col">Name</th>
        <th scope="col">Symbol</th>
        <th scope="col">Amount</th>
    </tr>
    `;

  let inventoryListsHTMLs = "";

  userFtsBalance.forEach((element) => {
    const inventoryListsHTML = `
      <tr class="tracing">
        <td><img class="logo" src="https://s2.coinmarketcap.com/static/img/coins/64x64/${
          element.ft_cmc_id
        }.png"></td>
        <td>${element.name}</td>
        <td>${element.symbol}</td>
        <td>${parseFloat(element.balance).toFixed(2)}</td>
      </tr>
      `;
    inventoryListsHTMLs += inventoryListsHTML;
  });

  inventoryLists.innerHTML = inventoryListsHTMLs;
}

async function main() {
  renderUserInfo();
  renderInventory();
}

main();
