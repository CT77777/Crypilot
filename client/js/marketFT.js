import * as logOut from "./modules/logOut.js";

const pageName = document.querySelector(".page-name");
pageName.textContent = "Market";

const ftMarketLists = document.querySelector(".market-lists");
const ftMarketListTitle = document.querySelector(".market-lists-title");

const sockets = [];

// render Market FT
async function getMarketFTList() {
  const response = await fetch("/market/ft/list");
  const results = await response.json();
  console.log(results);

  const responseTracing = await fetch("/market/ft/list/tracing");
  const resultsTracing = await responseTracing.json();
  console.log(resultsTracing);

  const ftList = results.ftList;
  const ftTracingIds = resultsTracing.ftTracingIds;

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
          }>Chat</button></td>
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
          }>Chat</button></td>
      </tr>
      `;
      ftListHTML += ftHTMLFalse;
    }
  }

  ftMarketLists.innerHTML = ftListHTML;

  addEventListenerStartChatBtn();
}

// add or remove tracing FT
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

// start chatting with openAI
function addEventListenerStartChatBtn() {
  const introCryptoButton = document.querySelectorAll(".intro-btn");
  const modalDialogBody = document.querySelector(".modal-body-gpt");
  const modalDialogBodyImage = modalDialogBody.querySelector(".image");
  const modalDialogBodyText = modalDialogBody.querySelector(".text");

  introCryptoButton.forEach((element) => {
    element.addEventListener("click", async () => {
      console.log("fetching GPT...");

      const userId = Cookies.get("user_id");

      const socket = io("ws://localhost:8080");
      socket.on("connect", () => {
        console.log("browser client connect to socket server...");
        sockets.push(socket);
      });
      socket.emit("join room", userId);

      const symbol = element.getAttribute("data-symbol");
      const jwt = Cookies.get("JWT");

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

    console.log(lastModalBodyContinueText);
    console.log(
      document.querySelector(".modal-content-gpt").children[
        document.querySelector(".modal-content-gpt").children.length - 2
      ]
    );

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

    const userId = Cookies.get("user_id");

    const socket = io("ws://localhost:8080");
    socket.on("connect", () => {
      console.log("browser client connect to socket server...");
      sockets.push(socket);
    });
    socket.emit("join room", userId);

    const jwt = Cookies.get("JWT");
    const inputText = document.querySelector(".continue-gpt-input").value;
    document.querySelector(".continue-gpt-input").value = "";
    const modalFooter = document.querySelector(".modal-footer-gpt");

    const modalBody = `
    <div class="modal-body modal-body-gpt-continue">
      <div class="image-container">
          <img class="image" src="../images/bot.png">
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
  await getMarketFTList();
  addEventListenerContinueChatBtn();
  addEventListenerCloseChatBtn();
  setInterval(getMarketFTList, 60000);
}

main();
