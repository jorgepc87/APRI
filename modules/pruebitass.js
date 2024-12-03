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
  const countryName = d.properties.name;
  const countryData = numberData.find(
	(country) => country.africanCountry === countryName
  );
  const partnerCount = countryData ? countryData.partnersNo : 0;

  if (partnerCount > 0) {
	const partnersList =
	  countryData && countryData.partners ? countryData.partners : [];
	// console.log(partnersList);
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
	  navigator.userAgent
	);

	// Generar el contenido del tooltip

	tooltip.html(`
		<div style="display: flex; flex-direction: column; width: 135px; position: relative;">
		
		  <div style="display: flex; justify-content: space-between; width: 135px;">
			<h3 style="margin: 0; font-family: 'RalewayN',   sans-serif; font-weight: bold; font-size: 13pt">${countryName}</h3>
			
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

	// Uso
	if (window.innerWidth <= 768) {
	  tooltip.style("display", "none");
	} else {
	  tooltip.style("display", "block");
	}

	// tooltip.style("display", "block");
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
	/* console.log(
	  `Country: ${countryName}, Area: ${areaInSquareKm.toFixed(2)} km²`
	);*/
	if (!isMobile) {
	  //       console.log(countryName);

	  if (areaInSquareKm.toFixed(2) < 250000) {
		console.log(countryName);

		// Mostrar el ícono en el centro de la ciudad
		g.append("image")
		  .attr("class", "hover-icon")
		  .attr("xlink:href", "img/icons/noun.svg")
		  .attr("width", 20)
		  .attr("height", 20)
		  .attr(
			"x",
			countryName == "Malawi"
			  ? path.centroid(d)[0] - 12
			  : path.centroid(d)[0] - 10 // Valor por defecto si no coincide con ninguna condición
		  )
		  .attr(
			"y",
			countryName == "Malawi"
			  ? path.centroid(d)[1] - 15
			  : path.centroid(d)[1] - 20 // Valor por defecto si no coincide con ninguna condición
		  )
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
		  .attr(
			"x",
			countryName == "Morocco"
			  ? path.centroid(d)[0] - 0
			  : countryName == "Zambia"
			  ? path.centroid(d)[0] - 20
			  : path.centroid(d)[0] - 10 // Valor por defecto si no coincide con ninguna condición
		  )
		  .attr(
			"y",
			countryName == "Morocco"
			  ? path.centroid(d)[1] - 30
			  : countryName == "Zambia"
			  ? path.centroid(d)[1] - 10
			  : path.centroid(d)[1] - 10 // Valor por defecto si no coincide con ninguna condición
		  )
		  .style("pointer-events", "none") // Ignora eventos del mouse
		  .style("opacity", 0)
		  .transition()
		  .duration(300)
		  .style("opacity", 1);
	  }
	}
  } else {
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
	  navigator.userAgent
	);
	if (!isMobile) {
	  tooltip.html(`
			<div style="display: flex; flex-direction: column; width: 135px; position: relative;">
			  <div style="display: flex; justify-content: space-between; align-items: center; width: 135px;">
				<h3 style="margin: 0; font-family: 'RalewayN', sans-serif; font-weight: bold; font-size: 13pt;">${countryName}</h3>
			
			  </div>
			</div>
		  `);
	  tooltip.style("display", "block");
	  //  tooltip.style("pointer-events", "none");

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
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(
	navigator.userAgent
  );
  if (isMobile) {
	g.selectAll(".city-label")
	  .filter((label) => label.properties.name === d.properties.name)
	  .transition()
	  .duration(300)
	  .style("opacity", 1);
  }
})
.on("mousemove", function (event, d) {
  // Mostrar el nombre de la ciudad en la consola
  const countryName = d.properties.name;
  //console.log("City name on mousemove:", countryName);

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	console.log("City name on mousemove:", countryName);
	const userAgent =
	  navigator.userAgent || navigator.vendor || window.opera;

	// Calcular las posiciones para centrar el tooltip
	const tooltipWidth = tooltip.node().offsetWidth;
	const tooltipHeight = tooltip.node().offsetHeight;
	let centerX;
	let centerY;
	if (/android/i.test(userAgent)) {
	  console.log("android");

	  centerX = window.innerWidth / 2 - tooltipWidth / 2 + 0;
	  centerY = window.innerHeight / 2 - tooltipHeight / 2 + 150; // Agregar 200px más abaj
	} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
	  console.log("IOS");

	  centerX = window.innerWidth / 2 - tooltipWidth / 2 + 30;
	  centerY = window.innerHeight / 2 - tooltipHeight / 2 + 200; // Agregar 200px más abaj
	} else {
	  console.log("android");

	  centerX = window.innerWidth / 2 - tooltipWidth / 2 + 30;
	  centerY = window.innerHeight / 2 - tooltipHeight / 2 + 200; // Agregar 200px más abaj
	}

	console.log(centerY);

	// Posicionar el tooltip al centro de la pantalla (ajustado)
	tooltip.style("left", centerX + "px").style("top", centerY + "px");
  } else {
	//console.log("City name on mousemove:", countryName);
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
