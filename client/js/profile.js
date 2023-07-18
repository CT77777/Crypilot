import * as logOut from "./modules/logOut.js";
import * as retrieveKey from "./modules/retrieveKey.js";
import * as secondFA from "./modules/2FA.js";
import * as logIn from "./modules/logIn.js";

async function getInventoryFts() {
  const response = await fetch("/wallet/fts");
  const results = await response.json();
  const { userFtsBalance } = results;

  return userFtsBalance;
}

async function renderAssetChart() {
  const pieChart = document.querySelector(".pie-chart");

  const userFtsBalance = await getInventoryFts();

  let data;
  let layout;

  if (userFtsBalance.length === 0) {
    data = [
      {
        values: [1],
        labels: [""],
        hoverinfo: "label+percent",
        textinfo: "label+percent",
        hole: 0.7,
        type: "pie",
        textposition: "inside",
        texttemplate: "%{label}",
        textfont: {
          size: 20,
          color: "#F0F8FF",
        },
        hoverlabel: {
          font: {
            color: "#F0F8FF",
          },
        },
        marker: {
          colors: [
            "#5B5E8B",
            "#FCB73E",
            "#C6C6F7",
            "#888C8F",
            "#ffc107",
            "#2e3343",
            "#543F03",
            "#382A02",
            "#1C1501",
            "#000000",
          ], // This will use a predefined color scale
        },
      },
    ];

    layout = {
      annotations: [
        {
          font: {
            size: 30,
            color: "#F0F8FF",
          },
          showarrow: false,
          text: "Asset",
        },
      ],
      height: 650,
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      showlegend: false,
    };
  } else {
    const values = [];
    const labels = [];

    userFtsBalance.forEach((ft) => {
      values.push(ft.value);
      labels.push(ft.symbol);
    });

    data = [
      {
        values: values,
        labels: labels,
        hoverinfo: "label+percent",
        textinfo: "label+percent",
        hole: 0.7,
        type: "pie",
        textposition: "inside",
        texttemplate: "%{label}",
        textfont: {
          size: 20,
          color: "#F0F8FF",
        },
        hoverlabel: {
          font: {
            color: "#F0F8FF",
          },
        },
        marker: {
          colors: [
            "#5B5E8B",
            "#FCB73E",
            "#C6C6F7",
            "#888C8F",
            "#ffc107",
            "#2e3343",
            "#543F03",
            "#382A02",
            "#1C1501",
            "#000000",
          ], // This will use a predefined color scale
        },
      },
    ];

    layout = {
      annotations: [
        {
          font: {
            size: 30,
            color: "#F0F8FF",
          },
          showarrow: false,
          text: "Asset",
        },
      ],
      height: 650,
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      showlegend: false,
    };
  }

  Plotly.newPlot(pieChart, data, layout);

  document.querySelector(".spinner-container-piechart").style.display = "none";
  pieChart.style.display = "flex";
}

async function getEthPrice() {
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";

  const response = await fetch("/trade/quote/exact/input", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      tokenIn: WETH,
      tokenInSymbol: "WETH",
      amountIn: "1",
      tokenOut: USDT,
      tokenOutSymbol: "USDT",
    }),
  });

  const results = await response.json();

  if (results.data) {
    const { amountOut } = results.data;
    const ethCount = parseFloat(
      document.querySelector(".eth-balance-count").textContent
    );

    const ethValue = document.querySelector(".eth-balance-value");

    const ethValueCal = (ethCount * amountOut).toFixed(2);
    ethValue.textContent = `${ethValueCal} USD`;
  } else {
    const ethCount = document.querySelector(".eth-balance-count");
    const ethValue = document.querySelector(".eth-balance-value");

    const ethValueCal = (ethCount * 2000).toFixed(2);
    ethValue.textContent = `${ethValueCal} USD`;
  }

  document.querySelector(".eth-balance").style.display = "flex";
  document.querySelector(".spinner-eth").style.display = "none";
}

function main() {
  renderAssetChart();
  getEthPrice();
}

main();
