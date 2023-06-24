const inventoryListTitles = document.querySelector(".inventory-list-titles");
const inventoryLists = document.querySelector(".inventory-lists");

async function getETHBalance() {
  const response = await fetch("/inventory/wallet");
  const results = await response.json();
  const { ethBalance } = results;

  return ethBalance;
}

async function renderInventory() {
  const ethBalance = await getETHBalance();
  console.log(ethBalance);

  inventoryListTitles.innerHTML = `
  <tr>
      <th scope="col">Logo</th>
      <th scope="col">Name</th>
      <th scope="col">Symbol</th>
      <th scope="col">Amount</th>
  </tr>
  `;

  inventoryLists.innerHTML = `
  <tr class="tracing">
    <td><img class="logo" src="${"https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"}"></td>
    <td>${"Ethereum"}</td>
    <td>${"ETH"}</td>
    <td>$${parseFloat(ethBalance).toFixed(2)}</td>
  </tr>
  `;
}

renderInventory();
