const pieChart = document.querySelector(".pie-chart");

var data = [
  {
    values: [16, 15, 12, 6, 5, 4, 42],
    labels: [
      "US",
      "China",
      "European Union",
      "Russian Federation",
      "Brazil",
      "India",
      "Rest of World",
    ],
    domain: { column: 0 },
    name: "GHG Emissions",
    hoverinfo: "label+percent+name",
    hole: 0.4,
    type: "pie",
  },
];

var layout = {
  title: "",
  annotations: [
    {
      font: {
        size: 20,
      },
      showarrow: false,
      text: "GHG",
      x: 0.17,
      y: 0.5,
    },
  ],
  height: 400,
  width: 600,
  showlegend: false,
  grid: { rows: 1, columns: 2 },
};

Plotly.newPlot(pieChart, data, layout);
