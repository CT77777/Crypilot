import * as logOut from "./modules/logOut.js";
import { renderUserInfo } from "./modules/userInfo.js";
import * as retrieveKey from "./modules/retrieveKey.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Tracing";

const ftMarketLists = document.querySelector(".market-lists");
const ftMarketListTitle = document.querySelector(".market-lists-title");

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
      tracingModalDialogContent.textContent = "Add tracing FT successfully";
      triggerTracingModalBtn.click();
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
      tracingModalDialogContent.textContent = "Remove tracing FT successfully";
      triggerTracingModalBtn.click();
      target.setAttribute("src", "../images/star-empty.png");
      target.setAttribute("data-state", "false");
      target.parentNode.parentNode.classList.remove("tracing");
    }
  }
});

function addEventListenerIntroBtn() {
  const introCryptoButton = document.querySelectorAll(".intro-btn");
  const modalDialogBody = document.querySelector(".modal-body");

  introCryptoButton.forEach((element) => {
    element.addEventListener("click", async () => {
      const symbol = element.getAttribute("data-symbol");
      const jwt = Cookies.get("JWT");

      console.log("fetching GPT...");

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
  renderUserInfo();
  await getTracingListFT();
  addEventListenerIntroBtn();
  setInterval(getTracingListFT, 60000);
}

main();
