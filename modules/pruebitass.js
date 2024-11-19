export function drawMapWithPartnerColors(svg, path, geojsonData, numberData) {
    svg.selectAll("path").remove();

    console.log("GeoJSON features:", geojsonData.features);
    console.log("Number data", numberData);
    const zoom2 = d3.zoom().scaleExtent([1, 4]).on("zoom", zoomed);

    const colorScale = d3
        .scaleQuantize()
        //   .domain([0, d3.max(numberData, (d) => d.partnersNo)])
        .domain([0, 6])

        .range([
            "#F2F2F2",
            "#FEE2A4",
            "#FCCA7B",
            "#FCC12C",
            "#EA9B0F",
            "#D68F01",
            "#9E6604"
        ]);
    const colorScaleShalow = d3
        .scaleQuantize()
        .domain([0, 6])
        .range([
            "#F2F2F2",
            "#FFF1D4",
            "#FCE0B1",
            "#FDDA84",
            "#F3C471",
            "#E2B369",
            "#BC8C46"
        ]);
    const partnerCounts = {};
    numberData.forEach((countryData) => {
        partnerCounts[countryData.africanCountry] = countryData.partnersNo;
    });

    g = svg.append("g");
    console.log(g)
    console.log("cesarrrr")

    // Crear tooltip
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip2")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "10px")
        .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)")
        .style("display", "none");

    const countries = g
        .selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d) => {
            const countryName = d.properties.name;
            const partnerCount = partnerCounts[countryName] || 0; // Si no hay socios, partnerCount será 0
            return colorScale(partnerCount); // Color inicial
        })
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("font-family", "RalewayN")

        .on("click", clicked)
        .on("mouseover", function (event, d) {

            const countryName = d.properties.name;
            const countryData = numberData.find(
                (country) => country.africanCountry === countryName
            );
            const partnerCount = countryData ? countryData.partnersNo : 0;

            if (partnerCount > 0) {
                const partnersList =
                    countryData && countryData.partners ? countryData.partners : [];

                // Generar el contenido del tooltip
                tooltip.html(`
            <div style="display: flex; flex-direction: column; width: 170px;">
              <div style="display: flex; justify-content: space-between; width: 170px;">
                <h3 style="margin: 0; font-family: 'RalewayN', sans-serif; font-weight: bold; font-size: 13pt">${countryName}</h3>
              </div>
              <p style="margin: 5px 0; margin-top: 8px; font-family: 'RalewayLightItalic', sans-serif; font-size: 11pt">${partnerCount} partner${partnerCount !== 1 ? "s" : ""}</p>
              <ul style="padding: 0; margin: 0; margin-top: 8px; font-size: 11pt; font-family: 'RalewayN', sans-serif;">
                ${partnersList.map((partner) => `<p style="padding: 0; margin: 0;">${partner}</p>`).join("")}
              </ul>
            </div>
          `);

                tooltip.style("display", "block");

                d3.select(this).transition().duration(300).style("opacity", 1);

                // Cambiar el color con colorScaleShalow
                const partnerCountShalow = partnerCount;
                d3.select(this).attr("fill", colorScaleShalow(partnerCountShalow));

                // Ocultar el nombre de la ciudad
                g.selectAll(".city-label")
                    .filter((label) => label.properties.name === d.properties.name)
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                    .style("pointer-events", "none") // Ignora eventos del mouse
                // Calcular el área del país
                const area = d3.geoArea(d);
                const areaInSquareKm = area * 510072000 / (4 * Math.PI); // Convierte el área en fracción de la esfera a km²
                console.log(`Country: ${countryName}, Area: ${areaInSquareKm.toFixed(2)} km²`);
                if (areaInSquareKm.toFixed(2) < 250000) {
                    // Mostrar el ícono en el centro de la ciudad
                    g.append("image")
                        .attr("class", "hover-icon")
                        .attr("xlink:href", "img/icons/noun.svg")
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("x", path.centroid(d)[0] - 10)
                        .attr("y", path.centroid(d)[1] - 20)
                        .style("pointer-events", "none") // Ignora eventos del mouse
                        .style("opacity", 0)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                }
                else {
                    // Mostrar el ícono en el centro de la ciudad
                    g.append("image")
                        .attr("class", "hover-icon")
                        .attr("xlink:href", "img/icons/noun.svg")
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("x", path.centroid(d)[0] - 10)
                        .attr("y", path.centroid(d)[1] - 10)
                        .style("pointer-events", "none") // Ignora eventos del mouse
                        .style("opacity", 0)
                        .transition()
                        .duration(300)
                        .style("opacity", 1);
                }

            } else {
                const partnersList =
                    countryData && countryData.partners ? countryData.partners : [];

                // Generar el contenido del tooltip
                tooltip.html(`
          <div style="display: flex; flex-direction: column; width: 170px;">
            <div style="display: flex; justify-content: space-between; width: 170px;">
              <h3 style="margin: 0; font-family: 'RalewayN', sans-serif; font-weight: bold; font-size: 13pt">${countryName}</h3>
            </div>
           
          </div>
        `);

                tooltip.style("display", "block");

                d3.select(this).transition().duration(300).style("opacity", 1);

                // Cambiar el color con colorScaleShalow
                const partnerCountShalow = partnerCount;
                d3.select(this).attr("fill", colorScaleShalow(partnerCountShalow));

                // Ocultar el nombre de la ciudad
                g.selectAll(".city-label")
                    .filter((label) => label.properties.name === d.properties.name)
                    .transition()
                    .duration(300)
                    .style("opacity", 0);


            }
        })
        .on("mouseout", function (event, d) {
            const countryName = d.properties.name;
            const partnerCount = partnerCounts[countryName] || 0; // Obtener el número de socios

            // Volver al color original con colorScale
            d3.select(this).attr("fill", colorScale(partnerCount));

            tooltip.style("display", "none");

            d3.select(this).transition().duration(300).style("opacity", 1);

            // Restaurar la visibilidad de los nombres de las ciudades
            if (isCountryLabelsVisible) {

                g.selectAll(".city-label")
                    .filter((label) => label.properties.name === d.properties.name)
                    .transition()
                    .duration(300)
                    .style("opacity", 1);

                // Ocultar el ícono
                g.selectAll(".hover-icon")
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                    .remove();
            } else {
                g.selectAll(".city-label")
                    .filter((label) => label.properties.name === d.properties.name)
                    .transition()
                    .duration(300)
                    .style("opacity", 0);

                g.selectAll(".hover-icon")
                    .transition()
                    .duration(300)
                    .style("opacity", 0)
                    .remove();
            }
        })
        .on("mousemove", function (event, d) {

            // Mostrar el nombre de la ciudad en la consola
            const countryName = d.properties.name;
            console.log("City name on mousemove:", countryName);
            if (countryName == "South Africa" || countryName == "Zambia") {
                tooltip
                    .style("left", event.pageX + 10 + "px") // Desplazar un poco a la derecha
                    .style("top", event.pageY - 200 + "px"); // Desplazar un poco hacia abajo
            } else {
                // Posicionar el tooltip mientras se mueve el mouse
                tooltip
                    .style("left", event.pageX + 10 + "px") // Desplazar un poco a la derecha
                    .style("top", event.pageY + 10 + "px");
            }



        });
    const labels = g
        .selectAll("text")
        .data(geojsonData.features)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .attr("x", (d) => path.centroid(d)[0])
        .attr("y", (d) => path.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("font-size", "5pt")
        .attr("font-family", "RalewayMedium")
        .attr("fill", "black")
        .style("opacity", function (d) {
            const countryName = d.properties.name;
            const partnerCount = partnerCounts[countryName] || 0;
            return partnerCount > 0 ? 1 : 0; // Solo muestra si hay acuerdos
        })
        .each(function (d) {
            const countryName = d.properties.name;
            const partnerCount = partnerCounts[countryName] || 0;
            if (partnerCount > 0) {
                const name = countryName.toUpperCase();
                const wrappedText = wrapText(name, 10); // Ajusta el número de caracteres por línea

                // Crear un tspan para cada línea de texto
                const textElement = d3.select(this);
                wrappedText.forEach((line, i) => {
                    if (name == "SENEGAL") {
                        textElement
                            .append("tspan")
                            .attr("x", path.centroid(d)[0] - 40)
                            .attr("y", (path.centroid(d)[1] + i * 8) + 5) // Ajusta la separación entre líneas
                            .text(line);
                    }
                    else if (name == "GUINEA") {
                        textElement
                            .append("tspan")
                            .attr("x", path.centroid(d)[0] - 40)
                            .attr("y", (path.centroid(d)[1] + i * 8) + 8) // Ajusta la separación entre líneas
                            .text(line);
                    }
                    else if (name == "IVORY COAST") {
                        textElement
                            .append("tspan")
                            .attr("x", path.centroid(d)[0] - 20)
                            .attr("y", (path.centroid(d)[1] + i * 8) + 35) // Ajusta la separación entre líneas
                            .text(line);
                    }
                    else if (name == "SOMALIA") {
                        textElement
                            .append("tspan")
                            .attr("x", path.centroid(d)[0] + 20)
                            .attr("y", (path.centroid(d)[1] + i * 8) + 25) // Ajusta la separación entre líneas
                            .text(line);
                    }
                    else {
                        textElement
                            .append("tspan")
                            .attr("x", path.centroid(d)[0])
                            .attr("y", (path.centroid(d)[1] + i * 8)) // Ajusta la separación entre líneas
                            .text(line);
                    }

                });
            }
        });

    // Función para envolver el texto en varias líneas
    function wrapText(text, maxLength) {
        const words = text.split(" ");
        let currentLine = "";
        const lines = [];

        words.forEach((word) => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? " " : "") + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) lines.push(currentLine); // Añadir la última línea

        return lines;
    }

    svg.call(zoom2);
    d3.selectAll("text").style("opacity", 0); // Ocultar los nombres de los países
    d3.selectAll("image").style("opacity", 0); // Mostrar los íconos

    function zoomed(event) {
        const { transform } = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }

    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        svg
            .transition()
            .duration(1200)
            .call(
                zoom2.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(
                        Math.min(
                            8,
                            0.9 / Math.max((x1 - x0) / width / 2, (y1 - y0) / height)
                        ) * 0.7
                    )
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.pointer(event, svg.node())
            );
    }
}
