import { width, height, svg } from "./globals.js";

let projection = d3
  .geoMercator()
  .scale(400)
  .translate([width / 2, height / 2]);
let path = d3.geoPath().projection(projection);
let zoom = d3.zoom().scaleExtent([1, 4]).on("zoom", zoomed);
let g;
// Función que maneja el evento de zoom
function zoomed(event) {
  const { transform } = event;
  g.attr("transform", transform);
  g.attr("stroke-width", 1 / transform.k);
}
//aumentar un parametro para identificar el pais y con ello hacer el zoom mas personalizado para cada uno - JORGE PAREDES
export function drawMap(geojson, filteredCountryGeoJSON, partner) {
  console.log(filteredCountryGeoJSON);
  // Establecer el viewBox inicial
  svg.attr("viewBox", `-100 0 1000 600`);

  // Crear un grupo <g> para contener los paths
  g = svg.append("g");

  // Eliminar los caminos existentes (opcional, si deseas eliminar los anteriores)
  svg.selectAll("path").remove();

  // Agregar los caminos de GeoJSON dentro del grupo <g>
  const paths = g
    .selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path) // Aquí asumo que tienes una variable 'path' definida previamente
    .attr("fill", "#d3d3d3")
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .on("click", clicked);
  //console.log(partner);
  const labels = g
    .selectAll("text")
    .data(filteredCountryGeoJSON.features)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("x", (d) => path.centroid(d)[0])
    .attr("y", (d) => path.centroid(d)[1])
    .attr("text-anchor", "middle")
    .attr("font-size", function (d) {
      if (partner === "EU") {
        return "1pt";
      } else if (partner === "EU") {
        return "1pt";
      } else if (partner === "BRICS Geological Platform") {
        return "1.5pt";
      } else if (partner === "Minerals Security Partnership") {
        return "1.5pt";
      } else if (partner === "EU Raw Materials Club") {
        return "1.5pt";
      } else if (partner === "Energy Resource Governance Initiative") {
        return "1.5pt";
      } else if (partner === "IPEF Critical Minerals Dialogue") {
        return "1.5pt";
      } else {
        return "5pt";
      }
    })
    .attr("fill", "black")
    .style("pointer-events", "none") // Ignora eventos del mouse

    .each(function (d) {
      const countryName = d.properties.name;
      const name = countryName.toUpperCase();
      const wrappedText = wrapText(name, 10); // Ajusta el número de caracteres por línea
      // Crear un tspan para cada línea de texto
      const textElement = d3.select(this);
      wrappedText.forEach((line, i) => {
        textElement
          .append("tspan")
          .attr("x", path.centroid(d)[0])
          .attr("y", path.centroid(d)[1] + i * 6) // Ajusta la separación entre líneas
          .text(line);
      });
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
  // Crear el comportamiento de zoom
  // aca se debe hacer los if para cada pais JORGE PAREDES
  const zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

  // Llamar al comportamiento de zoom sobre el SVG
  svg.call(zoom);
  d3.selectAll("text").style("opacity", 0); // Ocultar los nombres de los países

  // Función que maneja el evento de zoom
  function zoomed(event) {
    const { transform } = event;
    // Aplicar la transformación de zoom al grupo <g>
    g.attr("transform", transform);
    // Ajustar el grosor de las líneas al hacer zoom
    g.attr("stroke-width", 1 / transform.k);
  }
  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    svg
      .transition()
      .duration(1200)
      .call(
        zoom.transform,
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

  console.log("Paths created for map", paths);
}
export function destroyMap() {
  // Selecciona todo dentro del SVG y lo elimina
  svg.selectAll("*").remove();
  //console.log("Map destroyed, all paths and elements removed.");
}
let currentZoom = "";
let isCountryLabelsVisible = false; // Las etiquetas están no visibles por defecto

export function drawMapWithPartnerColors(svg, path, geojsonData, numberData) {
  svg.selectAll("path").remove();

  //console.log("GeoJSON features:", geojsonData.features);
  //console.log("Number data", numberData);
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
      "#9E6604",
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
      "#BC8C46",
    ]);
  const partnerCounts = {};
  numberData.forEach((countryData) => {
    partnerCounts[countryData.africanCountry] = countryData.partnersNo;
  });
  console.log(partnerCounts);
  g = svg.append("g");

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
      //console.log(d.properties.name + "__" + partnerCount);

      return colorScale(partnerCount); // Color inicial
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .attr("font-family", "RalewayN")

    .on("click", clicked)
    .on("mouseover", function (event, d) {
      //  console.log(d.properties.name);
      const countryName = d.properties.name;
      const countryData = numberData.find(
        (country) => country.africanCountry === countryName
      );
      const partnerCount = countryData ? countryData.partnersNo : 0;

      if (partnerCount > 0) {
        const partnersList =
          countryData && countryData.partners ? countryData.partners : [];
        console.log(partnersList);
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        // Generar el contenido del tooltip

        tooltip.html(`
			<div style="display: flex; flex-direction: column; width: 170px; position: relative;">
			  <!-- Botón de cierre -->
			  ${
          isMobile
            ? `<button 
				style="pointer-events:auto ; position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 12px; cursor: pointer;" 
				onclick="(function(event) { console.log("HOlaaaaaaa") ; event.stopPropagation(); d3.select('.tooltip2').style('display', 'none'); }>
				✖
				</button> `
            : ""
        }
			  <div style="display: flex; justify-content: space-between; width: 170px;">
				<h3 style="margin: 0; font-family: 'RalewayN', sans-serif; font-weight: bold; font-size: 13pt">${countryName}</h3>
			  </div>
			  <p style="margin: 5px 0; margin-top: 8px; font-family: 'RalewayLightItalic', sans-serif; font-size: 11pt">${partnerCount} partner${
          partnerCount !== 1 ? "s" : ""
        }</p>
			  <ul style="padding: 0; margin: 0; margin-top: 8px; font-size: 11pt; font-family: 'RalewayN', sans-serif;">
				${partnersList
          .map((partner) => `<p style="padding: 0; margin: 0;">${partner}</p>`)
          .join("")}
			  </ul>
			</div>
		  `);
        tooltip.style("display", "block");
        tooltip.style("pointer-events", "none");

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
          .style("pointer-events", "none"); // Ignora eventos del mouse
        // Calcular el área del país
        const area = d3.geoArea(d);
        const areaInSquareKm = (area * 510072000) / (4 * Math.PI); // Convierte el área en fracción de la esfera a km²
        console.log(
          `Country: ${countryName}, Area: ${areaInSquareKm.toFixed(2)} km²`
        );
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
        } else {
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
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        tooltip.html(`
			<div style="display: flex; flex-direction: column; width: 170px; position: relative;">
			  <div style="display: flex; justify-content: space-between; align-items: center; width: 170px;">
				<h3 style="margin: 0; font-family: 'RalewayN', sans-serif; font-weight: bold; font-size: 13pt;">${countryName}</h3>
				${
          isMobile
            ? `<button 
						style="
						pointer-events:auto ;
						  position: absolute; 
						  top: 0px; 
						  right: 5px; 
						  background: none; 
						  border: none; 
						  font-size: 12px; 
						  cursor: pointer; 
						  font-weight: bold;
						  color: #333;
						" 
						onclick="(function(event) { console.log("HOlaaaaaaa") ; event.stopPropagation(); d3.select('.tooltip2').style('display', 'none'); })(event)">
						✖
					  </button>`
            : ""
        }
			  </div>
			</div>
		  `);

        // Agregar evento al botón de cerrar si es móvil
        if (isMobile) {
          d3.select(".close-btn").on("click", function (event) {
            event.stopPropagation(); // Detener propagación del evento
            console.log("¡Hola! Se hizo clic en el botón cerrar.");
            d3.select(".tooltip2").style("display", "none"); // Cerrar el tooltip
          });
        }
        tooltip.style("display", "block");
        tooltip.style("pointer-events", "none");

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

      if (/Mobi|Android/i.test(navigator.userAgent)) {
        console.log("City name on mousemove:", countryName);

        // Calcular las posiciones para centrar el tooltip
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;

        const centerX = window.innerWidth / 2 - tooltipWidth / 2;
        const centerY = window.innerHeight / 2 - tooltipHeight / 2 + 250; // Agregar 200px más abajo

        console.log(centerY);

        // Posicionar el tooltip al centro de la pantalla (ajustado)
        tooltip.style("left", centerX + "px").style("top", centerY + "px");
      } else {
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
              .attr("y", path.centroid(d)[1] + i * 8 + 5) // Ajusta la separación entre líneas
              .text(line);
          } else if (name == "GUINEA") {
            textElement
              .append("tspan")
              .attr("x", path.centroid(d)[0] - 40)
              .attr("y", path.centroid(d)[1] + i * 8 + 8) // Ajusta la separación entre líneas
              .text(line);
          } else if (name == "IVORY COAST") {
            textElement
              .append("tspan")
              .attr("x", path.centroid(d)[0] - 20)
              .attr("y", path.centroid(d)[1] + i * 8 + 35) // Ajusta la separación entre líneas
              .text(line);
          } else if (name == "SOMALIA") {
            textElement
              .append("tspan")
              .attr("x", path.centroid(d)[0] + 20)
              .attr("y", path.centroid(d)[1] + i * 8 + 25) // Ajusta la separación entre líneas
              .text(line);
          } else {
            textElement
              .append("tspan")
              .attr("x", path.centroid(d)[0])
              .attr("y", path.centroid(d)[1] + i * 8) // Ajusta la separación entre líneas
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
    const countryName = d.properties.name;
    const partnerCount = partnerCounts[countryName] || 0; // Número de acuerdos del país

    if (partnerCount === 0) {
      // No hacer nada si el país no tiene acuerdos
      console.log(`${countryName} no tiene acuerdos, no se hará zoom.`);
      return;
    }
    tooltip.style("display", "block");

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
              200,
              0.9 / Math.max((x1 - x0) / width / 2, (y1 - y0) / height)
            ) * 1
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
  }
}

function updateProjection(scale, center, translation) {
  //console.log('PROJECTION in function', projection)
  projection = d3
    .geoNaturalEarth1()
    .scale(scale)
    .center(center)
    .translate(translation);
  path = d3.geoPath().projection(projection);
  svg.selectAll("path").attr("d", path);
}

//se modifico esta seccion para identificar por cada pais y realizar la proyeccion de cada item y personalizarlo - JORGE PAREDES
export function handleSelection(type, item) {
  // console.log(type);
  //console.log(item);
  // console.log("cesar");
  //  console.log("input FOR HANDLE SELECTOR", width);
  if (item == "EU") {
    updateProjection(300, [20, 0], [width / 1.5, height / 10]);
  } else if (item == "Saudi Arabia") {
    updateProjection(550, [20, 0], [width / 2, height / 1.6]);
  } else if (item == "United Arab Emirates") {
    updateProjection(580, [20, 0], [width / 3.2, height / 2]);
  } else if (item == "India") {
    updateProjection(400, [20, 0], [width / 3, height / 2]);
  } else if (item == "South Korea") {
    updateProjection(370, [20, 5], [width / 5, height / 2]);
  } else if (item == "Japan") {
    updateProjection(370, [20, 0], [width / 7, height / 2]);
  } else if (item == "China") {
    updateProjection(350, [20, 0], [width / 3.5, height / 1.7]);
  } else if (item == "Indonesia") {
    updateProjection(350, [20, 0], [width / 5, height / 1.7]);
  } else if (item == "Russia") {
    updateProjection(200, [40, 0], [width / 2, height / 2]);
  } else if (item == "USA") {
    updateProjection(250, [0, 0], [width / 2, height / 2]);
  } else if (item == "Turkey") {
    updateProjection(550, [20, 5], [width / 2, height / 1.3]);
  } else if (item == "EU Raw Materials Club") {
    updateProjection(400, [20, 10], [width / 1.35, height / 1.22]);
  } else if (item == "IPEF Critical Minerals Dialogue") {
    updateProjection(350, [20, 20], [width / 15, height / 3.7]);
  } else {
    updateProjection(210, [20, 0], [width / 2, height / 2]);
  }
  // if (type === "bilateral" || type === "multilateral") {
  //   updateProjection(210, [0, 0], [width / 2.2, height / 2]);
  // } else {
  //   updateProjection(450, [20, 0], [width / 2, height / 2]);
  // }
}

export function addCountryLabels2(geojsonData) {
  const countriesWithPartners = geojsonData.features.filter((feature) => {
    return feature.properties.partnersNo && feature.properties.partnersNo > 0;
  });
  svg.selectAll("text").remove();
  svg
    .selectAll("text")
    .data(countriesWithPartners)
    .enter()
    .append("text")
    .attr("transform", (d) => {
      const centroid = path.centroid(d);
      return `translate(${centroid})`;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "black")
    .text((d) => d.properties.name);
}

export function addCountryLabels() {
  isCountryLabelsVisible = true;
  d3.selectAll("text").transition().duration(500).style("opacity", 1); // Ocultar las etiquetas

  /* `
  if (currentZoom > 2) {
    d3.selectAll("image").transition().duration(500).style("opacity", 0); // Mostrar los íconos
    d3.selectAll("text").transition().duration(500).style("opacity", 1); // Ocultar las etiquetas
  } else {
    d3.selectAll("text").transition().duration(500).style("opacity", 0); // Mostrar las etiquetas
    d3.selectAll("image").transition().duration(500).style("opacity", 1); // Ocultar los íconos
  }*/
}

// Función para ocultar las etiquetas de los nombres de los países
export function deleteCountryLabels() {
  isCountryLabelsVisible = false;
  d3.selectAll("text").transition().duration(500).style("opacity", 0);
  d3.selectAll("image").transition().duration(500).style("opacity", 0); // Hacer invisibles los íconos
}

export function zoomToCountry(svg, path, geojsonData, countryName) {
  console.log(geojsonData);
  // Buscar el país en los datos geoJSON
  const countryFeature = geojsonData.features.find(
    (feature) => feature.properties.name === countryName
  );

  if (countryFeature) {
    // Obtener los límites del país
    const [[x0, y0], [x1, y1]] = path.bounds(countryFeature);

    // Realizar la transición para hacer zoom
    svg
      .transition()
      .duration(1200)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
          .translate(svg.attr("width") / 2, svg.attr("height") / 2)
          .scale(
            Math.min(
              8,
              0.9 /
                Math.max(
                  (x1 - x0) / svg.attr("width"),
                  (y1 - y0) / svg.attr("height")
                )
            ) * 0.7
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );
  } else {
    console.error(`Country "${countryName}" not found in geojson data.`);
  }
}

export function simulateCountryClick(svg, geojsonData, countryName) {
  // Buscar el país correspondiente en los datos GeoJSON
  const countryFeature = geojsonData.features.find(
    (feature) => feature.properties.name === countryName
  );

  if (countryFeature) {
    // Seleccionar el elemento <path> correspondiente al país
    const countryPath = svg
      .selectAll("path")
      .filter((d) => d === countryFeature);

    if (!countryPath.empty()) {
      // Simular el evento `click` en el elemento
      countryPath.dispatch("click");
    } else {
      console.error(`No SVG path found for country: ${countryName}`);
    }
  } else {
    console.error(`Country "${countryName}" not found in GeoJSON data.`);
  }
}

/*export function zoomToCountry(countryName) {
  const feature = mergedBiData.features.find(
    (d) => d.properties.name === countryName
  );
  if (!feature) return;
  const [centerX, centerY] = feature.properties.center || [0, 0];
  const zoomLevel = feature.properties.zoom || 1;
  let [x, y] = projection([centerX, centerY]);
  const transformMap = d3.zoomIdentity
    .translate(width, height)
    .scale(zoomLevel)
    .translate(-x, -y);
  svg.transition().duration(750).call(d3.zoom().transform, transformMap);
}*/
// Función para hacer zoom in
export function zoomIn() {
  svg.transition().duration(500).call(zoom.scaleBy, 1.5); // Incrementa el nivel de zoom
}

// Función para hacer zoom out
export function zoomOut() {
  svg.transition().duration(500).call(zoom.scaleBy, 0.75); // Reduce el nivel de zoom
}
export { path };
