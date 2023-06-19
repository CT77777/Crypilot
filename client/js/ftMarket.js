const ftMarketLists = document.querySelector(".market-lists");

async function getMarketFTList() {
  const response = await fetch("/market/ft/list");
  const results = await response.json();
  console.log(results);
  const ftList = results.ftList;
  let ftListHTML = "";

  for (let id in ftList) {
    const ft = ftList[id];
    const ftHTML = `
    <tr>
        <td><img class="favorite" src="../images/star-empty.png"></td>
        <td><img class="logo" src="${ft.logo}"></td>
        <td>${ft.name}</td>
        <td>${ft.symbol}</td>
        <td>$${ft.price.toFixed(2)}</td>
        <td>${ft.percent_change_24h.toFixed(2)}%</td>
        <td>${ft.percent_change_7d.toFixed(2)}%</td>
        <td>${ft.percent_change_30d.toFixed(2)}%</td>
        <td>$${ft.market_cap.toFixed(0)}</td>
        <td>$${ft.volume_24h.toFixed(0)}</td>
    </tr>
    `;
    ftListHTML += ftHTML;
  }

  ftMarketLists.innerHTML = ftListHTML;
}

getMarketFTList();
