const inventoryListTitles = document.querySelector(".inventory-list-titles");
const inventoryLists = document.querySelector(".inventory-lists");

async function getInventoryFts() {
  const response = await fetch("/inventory/wallet");
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
      <td>$${parseFloat(element.balance).toFixed(2)}</td>
    </tr>
    `;
    inventoryListsHTMLs += inventoryListsHTML;
  });

  inventoryLists.innerHTML = inventoryListsHTMLs;
}

renderInventory();
