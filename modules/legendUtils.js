export function addLegend(svg, colorScale) {
  //d3.select(".legend").remove();
  const legendContainer = d3.select(".third-col .card.partnership");
  legendContainer
    .append("h4")
    .attr("class", "legend-title")
    .style("text-align", "left")
    .style("margin", "10px 0")
    .style("font-weight", "bold")
    .style("font-size", "12pt")

    .text("Number of Partnerships");

  legendContainer
    .append("div")
    .attr("class", "line-black")
    .style("text-align", "left")
    .style("margin-top", "0px")

    .style("margin-bottom", "10px");

  const legend = legendContainer
    .append("div")
    .attr("class", "legend-vertical")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "left");

  colorScale.range().forEach((d, i) => {
    if (i > 0) {
      //console.log("D in color loop", d);
      //console.log("I in color loop", i);
      //console.log("D in color scale", colorScale.range());
      const legendItem = legend
        .append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin", "5px 0");

      legendItem
        .append("div")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color", colorScale.range()[i])
        .style("margin-right", "10px");
      //legendItem.shift();

      legendItem.append("span")
        .text(numberToWord(i))
        .style("font-size", "14px")
        .style("font-family", "RalewayN");
    }
  });
}
// Mapeo de números a palabras
const numberToWord = (num) => {
  const words = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6 +",
    // Agrega más números si es necesario
  };
  return words[num] || num; // Devuelve el número si no está en el mapeo
};

export function showLegend() {
  d3.select(".legend").style("display", "block");
}

export function hideLegend() {
  d3.select(".legend").style("display", "none");
}
