const ftMarketLists = document.querySelector(".market-lists");
const ftMarketListTitle = document.querySelector(".market-lists-title");

async function getMarketFTList() {
  const response = await fetch("/market/ft/list");
  const results = await response.json();
  console.log(results);

  const responseTracing = await fetch("/market/ft/list/tracing");
  const resultsTracing = await responseTracing.json();
  console.log(resultsTracing);

  const ftList = results.ftList;
  const ftTracingIds = resultsTracing.ftTracingIds;
  console.log(ftTracingIds);

  ftMarketListTitle.innerHTML = `
  <tr>
      <th scope="col"></th>
      <th scope="col">Logo</th>
      <th scope="col">Name</th>
      <th scope="col">Symbol</th>
      <th scope="col">Price(USD)</th>
      <th scope="col">24h%</th>
      <th scope="col">7d%</th>
      <th scope="col">30d%</th>
      <th scope="col">Market Cap</th>
      <th scope="col">Volume(24h)</th>
  </tr>
  `;

  let ftListHTML = "";

  for (let id in ftList) {
    const ft = ftList[id];

    if (ftTracingIds.indexOf(parseInt(id)) !== -1) {
      const ftHTMLTrue = `
      <tr class="tracing">
          <td><img class="favorite" data-state="true" data-cmc_id=${id} src="../images/star-fill.png"></td>
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
      ftListHTML += ftHTMLTrue;
    } else {
      const ftHTMLFalse = `
      <tr>
          <td><img class="favorite" data-state="false" data-cmc_id=${id} src="../images/star-empty.png"></td>
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
      ftListHTML += ftHTMLFalse;
    }
  }

  ftMarketLists.innerHTML = ftListHTML;
}

async function getTracingListFT() {
  const responseTracing = await fetch("/market/ft/list/tracing");
  const resultsTracing = await responseTracing.json();
  console.log(resultsTracing);

  const resultsTracingString = resultsTracing.ftTracingIds.join(",");

  const response = await fetch(`/market/ft/list?ids=${resultsTracingString}`);
  const results = await response.json();
  console.log(results);

  const ftList = results.ftList;
  const ftTracingIds = resultsTracing.ftTracingIds;
  console.log(ftTracingIds);

  ftMarketListTitle.innerHTML = `
  <tr>
      <th scope="col"></th>
      <th scope="col">Logo</th>
      <th scope="col">Name</th>
      <th scope="col">Symbol</th>
      <th scope="col">Price(USD)</th>
      <th scope="col">24h%</th>
      <th scope="col">7d%</th>
      <th scope="col">30d%</th>
      <th scope="col">Market Cap</th>
      <th scope="col">Volume(24h)</th>
  </tr>
  `;

  let ftListHTML = "";

  for (let id in ftList) {
    const ft = ftList[id];

    if (ftTracingIds.indexOf(parseInt(id)) !== -1) {
      const ftHTMLTrue = `
      <tr class="tracing">
          <td><img class="favorite" data-state="true" data-cmc_id=${id} src="../images/star-fill.png"></td>
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
      ftListHTML += ftHTMLTrue;
    } else {
      const ftHTMLFalse = `
      <tr>
          <td><img class="favorite" data-state="false" data-cmc_id=${id} src="../images/star-empty.png"></td>
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
      ftListHTML += ftHTMLFalse;
    }
  }
  ftMarketLists.innerHTML = ftListHTML;
}

// add/remove tracing ft
ftMarketLists.addEventListener("click", async (event) => {
  const target = event.target;

  if (
    target.getAttribute("class") === "favorite" &&
    target.getAttribute("data-state") === "false"
  ) {
    const jwt = Cookies.get("JWT");
    const cmc_id = target.getAttribute("data-cmc_id");

    const response = await fetch("/market/ft/tracing/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        cmc_id: cmc_id,
      }),
    });

    if (response.status === 200) {
      alert("add tracing FT successfully");
      target.setAttribute("src", "../images/star-fill.png");
      target.setAttribute("data-state", "true");
      target.parentNode.parentNode.setAttribute("class", "tracing");
    }
  } else if (
    target.getAttribute("class") === "favorite" &&
    target.getAttribute("data-state") === "true"
  ) {
    const jwt = Cookies.get("JWT");
    const cmc_id = target.getAttribute("data-cmc_id");

    const response = await fetch("/market/ft/tracing/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        cmc_id: cmc_id,
      }),
    });

    if (response.status === 200) {
      alert("remove tracing FT successfully");
      target.setAttribute("src", "../images/star-empty.png");
      target.setAttribute("data-state", "false");
      target.parentNode.parentNode.removeAttribute("class");
    }
  }
});

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

const tableMarket = document.querySelector(".table-market");
const tableTracing = document.querySelector(".table-tracing");

tableMarket.addEventListener("click", () => {
  getMarketFTList();
  clearInterval(intervalGet);
  intervalGet = setInterval(getMarketFTList, 10000);
});
tableTracing.addEventListener("click", () => {
  getTracingListFT();
  clearInterval(intervalGet);
  intervalGet = setInterval(getTracingListFT, 10000);
});

getMarketFTList();

let intervalGet = setInterval(getMarketFTList, 10000);
