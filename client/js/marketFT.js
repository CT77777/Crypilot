import * as logOut from "./modules/logOut.js";

const ftMarketLists = document.querySelector(".market-lists");
const ftMarketListTitle = document.querySelector(".market-lists-title");
const pageName = document.querySelector(".page-name");

pageName.textContent = "Market";

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
      <th scope="col">Introduction</th>
  </tr>
  `;

  let ftListHTML = "";

  for (let id in ftList) {
    const ft = ftList[id];

    if (ftTracingIds.indexOf(parseInt(id)) !== -1) {
      const ftHTMLTrue = `
      <tr class="tracing table-active">
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
          <td><button type="button" class="intro-btn btn btn-warning" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
            ft.symbol
          }>Read</button></td>
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
          <td><button type="button" class="intro-btn btn btn-warning" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
            ft.symbol
          }>Read</button></td>
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
  const { ftTracingIds } = resultsTracing;
  console.log(ftTracingIds);

  if (ftTracingIds.length === 0) {
    ftMarketLists.innerHTML = ``;
    return;
  }

  const resultsTracingString = ftTracingIds.join(",");

  const responseMarketByTracing = await fetch(
    `/market/ft/list?ids=${resultsTracingString}`
  );
  const resultsMarketByTracing = await responseMarketByTracing.json();
  console.log(resultsMarketByTracing);

  const { ftList } = resultsMarketByTracing;

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
      <th scope="col">Introduction</th>
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
          <td><button type="button" class="intro-btn btn btn-info" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
            ft.symbol
          }>Read</button></td>
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
          <td><button type="button" class="intro-btn btn btn-info" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
            ft.symbol
          }>Read</button></td>
      </tr>
      `;
      ftListHTML += ftHTMLFalse;
    }
  }
  ftMarketLists.innerHTML = ftListHTML;
}

// add or remove tracing ft
ftMarketLists.addEventListener("click", async (event) => {
  const target = event.target;
  const triggerTracingModalBtn = document.querySelector(".btn-tracing");
  const tracingModalDialogContent = document.querySelector(
    ".modal-body-tracing"
  );

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
      // alert("add tracing FT successfully");
      tracingModalDialogContent.textContent = "Add tracing FT successfully";
      triggerTracingModalBtn.click();
      target.setAttribute("src", "../images/star-fill.png");
      target.setAttribute("data-state", "true");
      target.parentNode.parentNode.setAttribute("class", "tracing");
      target.parentNode.parentNode.classList.add("table-active");
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
      // alert("remove tracing FT successfully");
      tracingModalDialogContent.textContent = "Remove tracing FT successfully";
      triggerTracingModalBtn.click();
      target.setAttribute("src", "../images/star-empty.png");
      target.setAttribute("data-state", "false");
      //   target.parentNode.parentNode.removeAttribute("class");
      target.parentNode.parentNode.classList.remove("tracing");
      target.parentNode.parentNode.classList.remove("table-active");
    }
  }
});

let intervalGet;

intervalGet = setInterval(getMarketFTList, 60000);

// intervalGet = setInterval(getTracingListFT, 60000);

function addEventListenerIntroBtn() {
  console.log(1);
  const introCryptoButton = document.querySelectorAll(".intro-btn");
  const modalDialogBody = document.querySelector(".modal-body");

  introCryptoButton.forEach((element) => {
    console.log(2);

    element.addEventListener("click", async () => {
      const symbol = element.getAttribute("data-symbol");
      const jwt = Cookies.get("JWT");

      console.log(3);

      const response = await fetch("/gpt/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ symbol: symbol }),
      });

      const result = await response.json();

      console.log(result);
      modalDialogBody.textContent = result;
    });
  });
}

async function main() {
  await getMarketFTList();
  addEventListenerIntroBtn();
  intervalGet = setInterval(getMarketFTList, 60000);
}

main();
