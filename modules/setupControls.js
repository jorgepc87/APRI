export function setupControls(svg, geojsonData, addCountryLabels) {
    let currentScale = 1;

    document.getElementById("toggle-names").addEventListener("change", function() {
        const showNames = this.checked;
        if (showNames) {
            addCountryLabels(geojsonData);
        } else {
            svg.selectAll("text").remove();
        }
    });

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            svg.attr("transform", event.transform);
            currentScale = event.transform.k;
        });

    svg.call(zoom);


}