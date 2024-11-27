// Set up dimensions and projection
const width = 900;
const height = 600;
const geojsonUrl =
  "https://raw.githubusercontent.com/Afripoli/D3-graph-gallery/refs/heads/master/DATA/world.geojson";
const jsonFilePath = "db/bilateralPartner.json";
const multiJsonFilePath = "db/multiPartner.json"; // Path to your multilateral partnership data
const noPartnerFilePath = "db/numberPartner.json";
const legendWidth = 50;
const legendHeight = 10;
const legendMargin = { top: 20, right: 20, bottom: 40, left: 10 };

// Initialize the SVG and append to #map
let svg = d3
  .select("#map")
  .append("svg")
  .attr("viewBox", `100 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("height", "100%") // Altura fija
  .attr("width", "100%"); // Altura fija

const customColors = [
  "#fcc12c",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#d62728",
  "#bcbd22",
  "#17becf",
  "#aec7e8",
  "#ffbb78",
  "#98df8a",
  "#ff9896",
  "#c5b0d5",
  "#c49c94",
  "#f7b6d2",
  "#c75b38",
  "#dbdb8d",
  "#9edae5",
];
const blocColors = {
  "BRICS Geological Platform": "#fcc12c", // Blue
  "Minerals Security Partnership": "#fcc12c", // Orange
  "EU Raw Materials Club": "#fcc12c", // Green
  "Energy Resource Governance Initiative": "#fcc12c", // Red
  "IPEF Critical Minerals Dialogue": "#fcc12c", // Purple
};

// Export the variables
export {
  width,
  height,
  svg,
  customColors,
  blocColors,
  geojsonUrl,
  jsonFilePath,
  multiJsonFilePath,
  noPartnerFilePath,
  legendWidth,
  legendHeight,
  legendMargin,
};
