import * as logOut from "./modules/logOut.js";
import * as retrieveKey from "./modules/retrieveKey.js";
import * as secondFA from "./modules/2FA.js";
import * as logIn from "./modules/logIn.js";
import { renderUserInfo } from "./modules/userInfo.js";

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
  document.querySelector(".main-wallet").style.display = "none";
  document.querySelector(".spinner-wallet").style.display = "block";

  const userFtsBalance = await getInventoryFts();

  console.log(userFtsBalance);

  if (userFtsBalance.length === 0) {
    document.querySelector(".span-wallet").style.display = "block";
    document.querySelector(".spinner-wallet").style.display = "none";
    return;
  }

  inventoryListTitles.innerHTML = `
    <tr>
        <th scope="col">Logo</th>
        <th scope="col">Name</th>
        <th scope="col">Symbol</th>
        <th scope="col">Amount</th>
        <th scope="col">Value(USD)</th>
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
        <td>${parseFloat(element.value).toFixed(2)}</td>
      </tr>
      `;
    inventoryListsHTMLs += inventoryListsHTML;
  });

  inventoryLists.innerHTML = inventoryListsHTMLs;

  document.querySelector(".main-wallet").style.display = "flex";
  document.querySelector(".spinner-wallet").style.display = "none";
}

async function main() {
  renderUserInfo();
  renderInventory();
}

main();
