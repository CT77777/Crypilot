import * as logOut from "./modules/logOut.js";
import * as retrieveKey from "./modules/retrieveKey.js";
import * as secondFA from "./modules/2FA.js";
import * as logIn from "./modules/logIn.js";
import { parseJWT } from "./modules/parseJWT.js";
import { SOCKET_URL } from "../config/config.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Tracing";

const ftMarketLists = document.querySelector(".market-lists");
const ftMarketListTitle = document.querySelector(".market-lists-title");

const sockets = [];

const prePriceTemps = {};

async function getTracingListFT() {
  const responseTracing = await fetch("/market/tracing/ft/list");
  const resultsTracing = await responseTracing.json();
  const { ftTracingIds } = resultsTracing.data;

  if (ftTracingIds.length === 0) {
    document.querySelector(".span-tracing").style.display = "block";
    document.querySelector(".spinner-tracing").style.display = "none";
    return false;
  }

  const resultsTracingString = ftTracingIds.join(",");

  const responseMarketByTracing = await fetch(
    `/market/ft/list?ids=${resultsTracingString}`
  );
  const resultsMarketByTracing = await responseMarketByTracing.json();

  const { ftList } = resultsMarketByTracing.data;

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
        <th scope="col">AI Intro.</th>
    </tr>
    `;

  let ftListHTML = "";

  for (let id in ftList) {
    const ft = ftList[id];

    if (ftTracingIds.indexOf(parseInt(id)) !== -1) {
      const ftHTMLTrue = `
        <tr class="tracing">
            <td><img class="favorite" data-state="true" data-cmc_id=${id} src="/images/star-fill.png"></td>
            <td><img class="logo" src="${ft.logo}"></td>
            <td>${ft.name}</td>
            <td class="td-symbol">${ft.symbol}</td>
            <td class="td-price">$${ft.price.toFixed(2)}</td>
            <td class="td-24h">${ft.percent_change_24h.toFixed(2)}%</td>
            <td class="td-7d">${ft.percent_change_7d.toFixed(2)}%</td>
            <td class="td-30d">${ft.percent_change_30d.toFixed(2)}%</td>
            <td>$${ft.market_cap.toFixed(0)}</td>
            <td>$${ft.volume_24h.toFixed(0)}</td>
            <td><button type="button" class="intro-btn btn btn-warning" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
              ft.symbol
            }>Chat</button></td>
        </tr>
        `;
      ftListHTML += ftHTMLTrue;
    } else {
      const ftHTMLFalse = `
        <tr>
            <td><img class="favorite" data-state="false" data-cmc_id=${id} src="/images/star-empty.png"></td>
            <td><img class="logo" src="${ft.logo}"></td>
            <td>${ft.name}</td>
            <td class="td-symbol">${ft.symbol}</td>
            <td class="td-price">$${ft.price.toFixed(2)}</td>
            <td class="td-24h">${ft.percent_change_24h.toFixed(2)}%</td>
            <td class="td-7d">${ft.percent_change_7d.toFixed(2)}%</td>
            <td class="td-30d">${ft.percent_change_30d.toFixed(2)}%</td>
            <td>$${ft.market_cap.toFixed(0)}</td>
            <td>$${ft.volume_24h.toFixed(0)}</td>
            <td><button type="button" class="intro-btn btn btn-info" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: 1rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-symbol=${
              ft.symbol
            }>Chat</button></td>
        </tr>
        `;
      ftListHTML += ftHTMLFalse;
    }
  }
  ftMarketLists.innerHTML = ftListHTML;

  const tdsSymbol = document.querySelectorAll(".td-symbol");
  const tdsPrice = document.querySelectorAll(".td-price");

  for (let i = 0; i < tdsSymbol.length; i++) {
    const number = tdsPrice[i].textContent.replace("$", "");
    const numberParse = parseFloat(number);

    if (Object.keys(prePriceTemps).length !== 0) {
      if (numberParse > prePriceTemps[tdsSymbol[i].textContent]) {
        tdsPrice[i].style.color = "green";
      } else if (numberParse < prePriceTemps[tdsSymbol[i].textContent]) {
        tdsPrice[i].style.color = "red";
      } else {
        tdsPrice[i].style.color = "";
      }
    }

    prePriceTemps[tdsSymbol[i].textContent] = numberParse;
  }

  const tds24h = document.querySelectorAll(".td-24h");
  tds24h.forEach((td) => {
    const number = td.textContent.replace("%", "");
    const numberParse = parseFloat(number);
    if (numberParse >= 0) {
      td.style.color = "green";
    } else {
      td.style.color = "red";
    }
  });

  const tds7d = document.querySelectorAll(".td-7d");
  tds7d.forEach((td) => {
    const number = td.textContent.replace("%", "");
    const numberParse = parseFloat(number);
    if (numberParse >= 0) {
      td.style.color = "green";
    } else {
      td.style.color = "red";
    }
  });

  const tds30d = document.querySelectorAll(".td-30d");
  tds30d.forEach((td) => {
    const number = td.textContent.replace("%", "");
    const numberParse = parseFloat(number);
    if (numberParse >= 0) {
      td.style.color = "green";
    } else {
      td.style.color = "red";
    }
  });

  addEventListenerStartChatBtn();

  return true;
}

// add or remove tracing ft
ftMarketLists.addEventListener("click", async (event) => {
  const target = event.target;

  if (
    target.getAttribute("class") === "favorite" &&
    target.getAttribute("data-state") === "false"
  ) {
    const jwt = Cookies.get("JWT");
    const cmc_id = target.getAttribute("data-cmc_id");

    const response = await fetch("/market/tracing/ft/list", {
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
      iziToast.show({
        theme: "dark",
        iconUrl: "/images/check-mark.png",
        title: "Add tracing crypto successfully",
        titleSize: 18,
        messageSize: 18,
        position: "topCenter",
        maxWidth: 500,
        timeout: 3000,
        pauseOnHover: true,
        drag: true,
        displayMode: 2,
      });
      target.setAttribute("src", "/images/star-fill.png");
      target.setAttribute("data-state", "true");
      target.parentNode.parentNode.setAttribute("class", "tracing");
    }
  } else if (
    target.getAttribute("class") === "favorite" &&
    target.getAttribute("data-state") === "true"
  ) {
    const jwt = Cookies.get("JWT");
    const cmc_id = target.getAttribute("data-cmc_id");

    const response = await fetch("/market/tracing/ft/list", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        cmc_id: cmc_id,
      }),
    });

    if (response.status === 200) {
      iziToast.show({
        theme: "dark",
        iconUrl: "/images/check-mark.png",
        title: "Remove tracing crypto successfully",
        titleSize: 18,
        messageSize: 18,
        position: "topCenter",
        maxWidth: 500,
        timeout: 3000,
        pauseOnHover: true,
        drag: true,
        displayMode: 2,
      });
      target.setAttribute("src", "/images/star-empty.png");
      target.setAttribute("data-state", "false");
      target.parentNode.parentNode.classList.remove("tracing");
    }
  }
});

// start chatting with openAI
function addEventListenerStartChatBtn() {
  const introCryptoButton = document.querySelectorAll(".intro-btn");
  const modalDialogBody = document.querySelector(".modal-body-gpt");
  const modalDialogBodyImage = modalDialogBody.querySelector(".image");
  const modalDialogBodyText = modalDialogBody.querySelector(".text");

  introCryptoButton.forEach((element) => {
    element.addEventListener("click", async () => {
      console.log("fetching GPT...");

      const jwt = Cookies.get("JWT");
      const { id: userId } = parseJWT(jwt);

      const socket = io(SOCKET_URL);
      socket.on("connect", () => {
        console.log("browser client connect to socket server...");
        sockets.push(socket);
      });
      socket.emit("join room", userId);

      const symbol = element.getAttribute("data-symbol");

      let isStart = true;

      socket.on("streaming", (content) => {
        if (isStart) {
          modalDialogBodyImage.style.display = "block";
          modalDialogBodyText.textContent = `: ${content}`;

          isStart = false;
        } else {
          modalDialogBodyText.textContent += content;
        }
      });

      const response = await fetch("/gpt/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ symbol: symbol }),
      });

      const result = await response.json();

      socket.disconnect();
      sockets.length = 0;

      console.log(result);
    });
  });
}

// continue chatting with openAI
function addEventListenerContinueChatBtn() {
  const continueGptBtn = document.querySelector(".continue-gpt-btn");

  continueGptBtn.addEventListener("click", async () => {
    if (document.querySelector(".continue-gpt-input").value === "") {
      return;
    }

    const lastModalBodyContinueText = document
      .querySelector(".modal-content-gpt")
      .children[
        document.querySelector(".modal-content-gpt").children.length - 2
      ].querySelector(".text");

    if (lastModalBodyContinueText.textContent === "Waiting...") {
      document
        .querySelector(".modal-content-gpt")
        .removeChild(
          document.querySelector(".modal-content-gpt").children[
            document.querySelector(".modal-content-gpt").children.length - 2
          ]
        );

      if (sockets.length !== 0) {
        sockets.forEach((element) => {
          element.disconnect();
        });
        sockets.length = 0;
      }
    }

    console.log("fetching GPT continue...");

    const jwt = Cookies.get("JWT");
    const { id: userId } = parseJWT(jwt);

    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("browser client connect to socket server...");
      sockets.push(socket);
    });
    socket.emit("join room", userId);

    const inputText = document.querySelector(".continue-gpt-input").value;
    document.querySelector(".continue-gpt-input").value = "";
    const modalFooter = document.querySelector(".modal-footer-gpt");

    const modalBody = `
    <div class="modal-body modal-body-gpt-continue">
      <div class="image-container">
          <img class="image" src="/images/bot.png">
      </div>
      <span class="text">Waiting...</span>
    </div>
    `;

    modalFooter.insertAdjacentHTML("beforebegin", modalBody);

    let modalDialogBodyContinueText = document
      .querySelector(".modal-content-gpt")
      .children[
        document.querySelector(".modal-content-gpt").children.length - 2
      ].querySelector(".text");

    let isStart = true;

    socket.on("streamingContinue", (content) => {
      if (isStart) {
        modalDialogBodyContinueText.textContent = `: ${content}`;
        isStart = false;
      } else {
        modalDialogBodyContinueText.textContent += content;
      }
    });

    const response = await fetch("/gpt/continue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ inputText }),
    });

    const result = await response.json();

    socket.disconnect();
    sockets.length = 0;

    console.log(result);
  });
}

// clear record after closing the ChatGPT dialog
function addEventListenerCloseChatBtn() {
  const closeGptBtn = document.querySelector(".btn-close-gpt");

  closeGptBtn.addEventListener("click", () => {
    const modalContent = document.querySelector(".modal-content-gpt");
    const modalBodyStart = document.querySelector(".modal-body-gpt");
    const modalBodyContinues = document.querySelectorAll(
      ".modal-body-gpt-continue"
    );

    if (modalBodyStart !== undefined) {
      modalBodyStart.querySelector(".text").textContent = `Waiting...`;
    }

    if (modalBodyContinues.length !== 0) {
      modalBodyContinues.forEach((element) => {
        modalContent.removeChild(element);
      });
    }

    if (sockets.length !== 0) {
      sockets.forEach((element) => {
        element.disconnect();
      });
      sockets.length = 0;
    }
  });
}

async function main() {
  document.querySelector(".main-tracing").style.display = "none";
  document.querySelector(".spinner-tracing").style.display = "block";
  const isTracingFts = await getTracingListFT();
  if (isTracingFts) {
    document.querySelector(".main-tracing").style.display = "flex";
  }
  document.querySelector(".spinner-tracing").style.display = "none";
  addEventListenerContinueChatBtn();
  addEventListenerCloseChatBtn();
  setInterval(getTracingListFT, 60000);
}

main();
