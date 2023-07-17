import * as logOut from "./modules/logOut.js";
import * as retrieveKey from "./modules/retrieveKey.js";
import * as secondFA from "./modules/2FA.js";
import * as logIn from "./modules/logIn.js";
import { renderUserInfo } from "./modules/userInfo.js";

async function getInventoryFts() {
  const response = await fetch("/wallet/fts");
  const results = await response.json();
  const { userFtsBalance } = results;

  return userFtsBalance;
}

async function renderAssetChart() {
  const pieChart = document.querySelector(".pie-chart");

  const userFtsBalance = await getInventoryFts();

  console.log(userFtsBalance.length);

  let data;
  let layout;

  if (userFtsBalance.length === 0) {
    data = [
      {
        values: [1],
        labels: [""],
        hoverinfo: "label+percent",
        textinfo: "label+percent",
        hole: 0.4,
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
            "#7895CB",
            "#787A91",
            "#3C486B",
            "#9DB2BF",
            "#27374D",
            "#A0BFE0",
            "#B7CADB",
            "#454545",
            "#4A55A2",
            "#7895CB",
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
        hole: 0.4,
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
            "#7895CB",
            "#787A91",
            "#3C486B",
            "#9DB2BF",
            "#27374D",
            "#A0BFE0",
            "#B7CADB",
            "#454545",
            "#4A55A2",
            "#7895CB",
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
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      showlegend: false,
    };
  }

  // data = [
  //   {
  //     values: values,
  //     labels: labels,
  //     hoverinfo: "label+percent",
  //     textinfo: "label+percent",
  //     hole: 0.4,
  //     type: "pie",
  //     textposition: "inside",
  //     texttemplate: "%{label}",
  //     textfont: {
  //       size: 20,
  //       color: "#F0F8FF",
  //     },
  //     hoverlabel: {
  //       font: {
  //         color: "#F0F8FF",
  //       },
  //     },
  //     marker: {
  //       colors: [
  //         "#7895CB",
  //         "#787A91",
  //         "#3C486B",
  //         "#9DB2BF",
  //         "#27374D",
  //         "#A0BFE0",
  //         "#B7CADB",
  //         "#454545",
  //         "#4A55A2",
  //         "#7895CB",
  //       ], // This will use a predefined color scale
  //     },
  //   },
  // ];

  // layout = {
  //   annotations: [
  //     {
  //       font: {
  //         size: 30,
  //         color: "#F0F8FF",
  //       },
  //       showarrow: false,
  //       text: "Asset",
  //     },
  //   ],
  //   plot_bgcolor: "rgba(0, 0, 0, 0)",
  //   paper_bgcolor: "rgba(0, 0, 0, 0)",
  //   showlegend: false,
  // };

  Plotly.newPlot(pieChart, data, layout);
}

function main() {
  renderUserInfo();
  renderAssetChart();
}

main();
