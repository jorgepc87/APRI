import { svg } from "./globals.js";
import { path } from "./mapUtils.js";

export function handleSelection(type, item) {
  //console.log(type);
  //console.log(item);
  //console.log("cccc");
  if (type === "bilateral" || type === "multilateral") {
    updateProjection(210, [0, 0], [width / 2.2, height / 2]);
  } else {
    updateProjection(450, [20, 0], [width / 2, height / 2]);
  }
}

export function toggleButton(button) {
  const isPressed = button.getAttribute("aria-pressed") === "true";
  button.setAttribute("aria-pressed", !isPressed);
}

export function highlightPartnership(svg, filteredGeoJSON, itemSelected) {
  ////console.log('Highlighting partnership', partnerMap[selectedCountry]);
  const partnerCountries = new Set(
    filteredGeoJSON.features.map((f) => f.properties.name)
  );
  console.log("item selected in export function", partnerCountries);

  //console.log("Partner countries test", partnerCountries);
  //console.log("Parner countries", partnerCountries);
  svg
    .selectAll("path")

    .attr("fill", (d) => {
     // console.log("item ", d.properties.name + "el otro es" + itemSelected);

      if (d.properties.name.toString() == itemSelected.toString()) {
        return "#fec030"; // Color para los países en blocCountries
      } else if (partnerCountries.has(d.properties.name)) {
        console.log("COINMCIDENNNN");
        return "#FFDC94"; // Color alternativo
      } else {
        return "#f2f2f2"; // Color por defecto
      }
    })

    /* .attr("fill", (d) =>
      partnerCountries.has(d.properties.name) ? "#fec03c" : "#f2f2f2"
    )*/
    .transition()
    .duration(500);
  //console.log("filtered geo json after highlight", filteredGeoJSON.features);
  //adjustViewbox(itemSelected);
}

function adjustViewbox(itemSelected) {
  //console.log("item selected in function", itemSelected);
  if (itemSelected === "Saudi Arabia") {
    svg.attr("viewBox", "100 0 600 600");
  } else if (itemSelected === "United Arab Emirates") {
    svg.attr("viewBox", "150 0 500 600");
  } else if (itemSelected === "India") {
    svg.attr("viewBox", "225 0 500 600");
  } else if (itemSelected === "South Korea") {
    svg.attr("viewBox", "300 50 500 350");
  } else if (itemSelected === "Japan") {
    svg.attr("viewBox", "325 0 500 600");
  } else if (itemSelected === "China") {
    svg.attr("viewBox", "275 -50 500 600");
  } else if (itemSelected === "Indonesia") {
    svg.attr("viewBox", "250 0 600 600");
  } else if (itemSelected === "Russia") {
    svg.attr("viewBox", "250 -75 600 600");
  } else if (itemSelected === "USA") {
    svg.attr("viewBox", "-75 -50 600 600");
  } else if (itemSelected === "Turkey") {
    svg.attr("viewBox", "150 -25 500 600");
  }
}
export function highlightEu(svg, filteredGeoJSON) {
  const euCountries = new Set(
    filteredGeoJSON.features.map((f) => f.properties.name)
  );
  // Lista de países a excluir
  const excludedCountries = new Set([
    "Zambia",
    "Rwanda",
    "Namibia",
    "Democratic Republic of the Congo",
  ]);
  // Crear un nuevo arreglo excluyendo los países
  const updatedCountries = Array.from(euCountries).filter(
    (country) => !excludedCountries.has(country)
  );

  console.log(updatedCountries);

  const updatedCountriesSet = new Set(updatedCountries);

  
  svg
    .selectAll("path")
    .attr("fill", (d) =>
      excludedCountries.has(d.properties.name)
        ? "#FFDC94 " // Amarillo para excludedCountries
        : updatedCountriesSet.has(d.properties.name)
        ? "#fec03c" // Verde para updatedCountries
        : "#f2f2f2" // Gris claro para el resto
    );

  svg.attr("viewBox", "-100 0 1000 600");
  // svg.attr("viewBox", "100 50 600 350");
}

export function updateLabel(svg, path, filteredGeoJSON) {
  if (
    !filteredGeoJSON ||
    !filteredGeoJSON.features ||
    filteredGeoJSON.features.length === 0
  ) {
    //console.log("No features found in the filtered GeoJSON.");
    return;
  }
  //console.log(`Number of features to label: ${filteredGeoJSON.features.length}` );
  svg.selectAll("text").remove();
  svg
    .selectAll("text")
    .data(filteredGeoJSON.features)
    .enter()
    .append("text")
    .attr("transform", (d) => {
      const centroid = path.centroid(d);
      /*//console.log(
				`Labeling country: ${d.properties.name}, Centroid: ${centroid}`
			);*/
      return `translate(${centroid})`;
    })
    .attr("dy", ".3em")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "black")
    .text((d) => d.properties.name);
}

export function populatePartnerships(biData, selectedCountry) {
  let partnerSelected;
  const infoPartnerContainer = document.querySelector(".card");
  infoPartnerContainer.innerHTML = "";
  const bilateralPartner = document.createElement("h2");
  bilateralPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "h2"
  );
  if (selectedCountry === "EU") {
    partnerSelected = biData.find(
      (country) => country.nonafrican.name === selectedCountry
    );
    bilateralPartner.innerHTML = `${partnerSelected.nonafrican.name}`;
  } else {
    partnerSelected = biData.find(
      (country) => country.nonafrican === selectedCountry
    );
    bilateralPartner.innerHTML = `${partnerSelected.nonafrican}`;
  }
  // Agregar la línea roja debajo del H2 dinámicamente
  bilateralPartner.style.borderBottom = "2px solid #ffb300"; // Línea roja de 2px
  bilateralPartner.style.paddingBottom = "10px"; // Espacio entre el texto y la línea
  bilateralPartner.style.marginTop = "0px !importat"; // Espacio entre el texto y la línea

  infoPartnerContainer.appendChild(bilateralPartner);

  // Crear el contenedor para el contenido con scroll
  const scrollContainer = document.createElement("div");
  scrollContainer.classList.add("custom-scroll"); // Se añade 'custom-scroll' aquí
  scrollContainer.style.maxHeight = "100%"; // Establecer el alto máximo para hacer scroll
  scrollContainer.style.overflowY = "auto"; // Activar el scroll vertical
  scrollContainer.style.marginTop = "10px"; // Espacio entre el título y el contenido

  infoPartnerContainer.appendChild(scrollContainer);

  partnerSelected.partnership.forEach((partner) => {
    ////console.log('Partnership in container', partner)
    const partnershipCard = document.createElement("div");
    partnershipCard.classList.add(
      "card-body",
      "mb-3",
      "partner",
      "custom-scroll"
    );
    const partnerTitle = document.createElement("h5");
    partnerTitle.classList.add("card-title", "list-partners");
    partnerTitle.innerHTML = `${partner.country}`;
    partnershipCard.appendChild(partnerTitle);
    if (partner.agreements) {
      //console.log("Multiple agreements", partner.agreements);

      //for para cada acuerdo
      //console.log("Multiple agreements", partner.agreements);
      partner.agreements.forEach((agreement) => {
        const partnerAgreement = document.createElement("h5");
        partnerAgreement.classList.add("card-subtitle", "mb-1", "agreement");
        partnerAgreement.innerHTML = agreement.typeAgreement
          ? `${agreement.typeAgreement}`
          : "";
        partnershipCard.appendChild(partnerAgreement);
        // Crear el elemento para el tiempo (time) y agregarlo segundo
        const time = document.createElement("p");
        time.classList.add("card-text", "mb-1");
        time.innerHTML = `<strong>Signed:</strong> ${agreement.year}`;
        time.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
        time.style.fontSize = "11pt"; // Aplicar la fuente personalizada
        time.style.paddingBottom = "0px"; // Aplicar la fuente personalizada

        partnershipCard.appendChild(time);

        // Crear el párrafo para Access y agregarlo al final
        const access = document.createElement("p");
        access.classList.add("card-text", "mb-1");
        access.innerHTML = `<strong>Access:</strong> Publicly available`;
        access.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
        access.style.fontSize = "11pt"; // Aplicar la fuente personalizada
        access.style.paddingBottom = "0px"; // Aplicar la fuente personalizada

        // Crear el ícono
        const icon = document.createElement("img");
        icon.src = "img/icons/web.svg"; // Ruta del ícono PNG
        icon.alt = "Icono de acceso"; // Texto alternativo
        icon.style.height = "20px";
        icon.classList.add("ms-2"); // Margen a la izquierda

        // Crear el enlace
        const link = document.createElement("a");
        link.href = agreement.linkAgreement
          ? `${agreement.linkAgreement}`
          : `${agreement.sources}`;
        link.target = "_blank"; // Abrir en una nueva pestaña
        link.classList.add("ms-2"); // Margen izquierdo
        link.textContent = "View agreement"; // Texto del enlace

        // Aplicar estilos al enlace
        link.style.textDecoration = "none"; // Eliminar el subrayado
        link.style.fontSize = "11pt"; // Eliminar el subrayado

        link.style.color = "#0071BC"; // Cambiar

        // Agregar el ícono y el enlace al párrafo Access
        access.appendChild(icon);
        access.appendChild(link);

        // Agregar el párrafo Access al partnershipCard
        partnershipCard.appendChild(access);

        //console.log("nuevoooooooooooo");

        //console.log(agreement.areasCoop);
        if (agreement.areasCoop != "") {
          // Crear el subtítulo de "Areas of Cooperation"
          const areasTitle = document.createElement("h1");
          areasTitle.classList.add("card-text");
          areasTitle.style.fontWeight = "bold"; // Poner el texto en negrita
          areasTitle.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
          areasTitle.style.fontSize = "11pt"; // Aplicar la fuente personalizada
          areasTitle.style.paddingBottom = "0px"; // Aplicar la fuente personalizada
          areasTitle.style.marginBottom = "0px"; // Aplicar la fuente personalizada

          areasTitle.innerHTML = "Areas of Cooperation:";
          partnershipCard.appendChild(areasTitle);

          // Contenedor de tags
          const tagsContainer = document.createElement("div");
          tagsContainer.classList.add("mb-3");
          const rightElement = document.querySelector(".right");
          rightElement.style.marginTop = "0px"; // Ajusta el valor según lo que necesites

          const colorMap = {
            "Economic Diversification / Value Addition": "#75D1D1",
            "Training & Capacity Building": "#F4A27D",
            "Knowledge Sharing / Joint Research / Expert Exchanges": "#E3F5F5",
            "Technology Sharing": "#FFDC94",
            "Cooperation on Extraction": "#EF9CAF",
            "Promotion of Company Cooperation": "#CCE2CB",
            "Promotion of Investment": "#98C1A8",
            "Mining Infrastructure Development": "#C7D78F",
            "Promotion of Social & Environmental Sustainability": "#FFD8BD",
            "Cooperation on Legislation & Policies": "#FFFCB6",
            "Cooperation on Exploration & Geology": "#CBAACB",
            "Value Chain Integration": "#EBD6E4",
          };

          // Crear los tags para cada área de cooperación con colores específicos
          agreement.areasCoop.forEach((area) => {
            const tag = document.createElement("span");
            tag.classList.add("tag");
            tag.textContent = area;

            // Aplicar el color específico al fondo del tag según el área de cooperación
            tag.style.backgroundColor = colorMap[area] || "#000000"; // Color por defecto si el área no está en el mapa
            tag.style.color = "black"; // Texto en color negro

            // Crear el tooltip
            const tooltip = document.createElement("span");
            tooltip.classList.add("tooltip");
            tooltip.textContent = area;

            // Añadir el tooltip al tag
            tag.appendChild(tooltip);

            // Añadir el tag al contenedor de tags
            tagsContainer.appendChild(tag);
          });
          // Agregar el contenedor de tags a partnershipCard
          partnershipCard.appendChild(tagsContainer);
        }
      });
    } else if (partner.typeAgreement) {
      // Crear el elemento para partnerAgreement y agregarlo primero
      const partnerAgreement = document.createElement("h5");
      partnerAgreement.classList.add("card-subtitle", "mb-1", "agreement");
      partnerAgreement.innerHTML = partner.typeAgreement
        ? `${partner.typeAgreement}`
        : "";
      partnershipCard.appendChild(partnerAgreement);

      // Crear el elemento para el tiempo (time) y agregarlo segundo
      const time = document.createElement("p");
      time.classList.add("card-text", "mb-1");
      time.innerHTML = `<strong>Signed:</strong> ${partner.year}`;
      time.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
      time.style.fontSize = "11pt"; // Aplicar la fuente personalizada
      time.style.paddingBottom = "0px"; // Aplicar la fuente personalizada

      partnershipCard.appendChild(time);

      // Crear el párrafo para Access y agregarlo al final
      const access = document.createElement("p");
      access.classList.add("card-text", "mb-1");

      access.innerHTML = partner.linkAgreement
        ? `<strong>Access:</strong> Publicly available`
        : `<strong>Access:</strong> Not publicly available`;

      access.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
      access.style.fontSize = "11pt"; // Aplicar la fuente personalizada
      access.style.paddingBottom = "0px"; // Aplicar la fuente personalizada

      // Crear el ícono
      const icon = document.createElement("img");
      icon.src = "img/icons/web.svg"; // Ruta del ícono PNG
      icon.alt = "Icono de acceso"; // Texto alternativo
      icon.style.height = "20px";
      icon.classList.add("ms-2"); // Margen a la izquierda

      // Crear el enlace
      const link = document.createElement("a");
      link.href = partner.linkAgreement
        ? `${partner.linkAgreement}`
        : `${partner.sources}`;
      link.target = "_blank"; // Abrir en una nueva pestaña
      link.classList.add("ms-2"); // Margen izquierdo

      link.textContent = partner.linkAgreement
        ? "View agreement"
        : "View source";

      // Aplicar estilos al enlace
      link.style.textDecoration = "none"; // Eliminar el subrayado
      link.style.fontSize = "11pt"; // Eliminar el subrayado
      link.style.color = "#0071BC"; // Cambiar

      // Agregar el ícono y el enlace al párrafo Access
      access.appendChild(icon);
      access.appendChild(link);

      // Agregar el párrafo Access al partnershipCard
      partnershipCard.appendChild(access);

      //console.log(partner.areasCoop);
      if (partner.areasCoop != "") {
        // Crear el subtítulo de "Areas of Cooperation"
        const areasTitle = document.createElement("h1");
        areasTitle.classList.add("card-text");
        areasTitle.style.fontWeight = "bold"; // Poner el texto en negrita
        areasTitle.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
        areasTitle.style.fontSize = "11pt"; // Aplicar la fuente personalizada
        areasTitle.style.paddingBottom = "0px"; // Aplicar la fuente personalizada
        areasTitle.style.marginBottom = "0px"; // Aplicar la fuente personalizada

        areasTitle.innerHTML = "Areas of Cooperation:";
        partnershipCard.appendChild(areasTitle);

        // Contenedor de tags
        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("mb-3");
        const rightElement = document.querySelector(".right");
        rightElement.style.marginTop = "0px"; // Ajusta el valor según lo que necesites

        const colorMap = {
          "Economic Diversification / Value Addition": "#75D1D1",
          "Training & Capacity Building": "#F4A27D",
          "Knowledge Sharing / Joint Research / Expert Exchanges": "#E3F5F5",
          "Technology Sharing": "#FFDC94",
          "Cooperation on Extraction": "#EF9CAF",
          "Promotion of Company Cooperation": "#CCE2CB",
          "Promotion of Investment": "#98C1A8",
          "Mining Infrastructure Development": "#C7D78F",
          "Promotion of Social & Environmental Sustainability": "#FFD8BD",
          "Cooperation on Legislation & Policies": "#FFFCB6",
          "Cooperation on Exploration & Geology": "#CBAACB",
          "Value Chain Integration": "#EBD6E4",
        };

        // Crear los tags para cada área de cooperación con colores específicos
        partner.areasCoop.forEach((area) => {
          const tag = document.createElement("span");
          tag.classList.add("tag");
          tag.textContent = area;

          // Aplicar el color específico al fondo del tag según el área de cooperación
          tag.style.backgroundColor = colorMap[area] || "#000000"; // Color por defecto si el área no está en el mapa
          tag.style.color = "black"; // Texto en color negro

          // Crear el tooltip
          const tooltip = document.createElement("span");
          tooltip.classList.add("tooltip");
          tooltip.textContent = area;

          // Añadir el tooltip al tag
          tag.appendChild(tooltip);

          // Añadir el tag al contenedor de tags
          tagsContainer.appendChild(tag);
        });
        // Agregar el contenedor de tags a partnershipCard
        partnershipCard.appendChild(tagsContainer);
      }
    }
    scrollContainer.appendChild(partnershipCard);

    infoPartnerContainer.appendChild(scrollContainer);
  });
}

export function populateMultilateral(multiData, selectedBloc, multiJsonData) {
  //console.log("Multi JSON data to populate", multiData);
  selectedBloc = selectedBloc.replace(/\s+/g, " ");
  let blocCountries = multiData.features;
  const infoMultiContainer = document.querySelector(".card");
  infoMultiContainer.innerHTML = "";
  const rightElement = document.querySelector(".right");
  rightElement.style.marginTop = "0px"; // Ajusta el valor según lo que necesites

  // Crear y agregar el contenedor con scroll para todo el contenido relacionado
  const scrollContainer = document.createElement("div");
  scrollContainer.classList.add("custom-scroll"); // Se añade la clase para estilos personalizados
  scrollContainer.style.maxHeight = "100%"; // Altura máxima para el contenedor
  scrollContainer.style.overflowY = "auto"; // Habilitar scroll vertical
  scrollContainer.style.marginTop = "10px"; // Espacio entre el título y el contenido
  scrollContainer.style.paddingRight = "18px"; // Espacio entre el título y el contenido

  // Crear y agregar el título principal
  const multiPartner = document.createElement("h2");
  multiPartner.style.borderBottom = "2pt solid #ffb300"; // Línea roja de 2px
  multiPartner.style.paddingBottom = "10px"; // Espacio entre el texto y la línea
  multiPartner.style.fontSize = "22pt";
  multiPartner.style.fontWeight = "bold";

  multiPartner.classList.add(
    "card-title",
    "card-title-fixed",
    "partner-select",
    "mt-3"
  );
  multiPartner.innerHTML = `${selectedBloc}`;
  infoMultiContainer.appendChild(multiPartner);

  //  scrollContainer.appendChild(); // Agregar el título al contenedor con scroll

  // Agregar el texto Lorem Ipsum debajo del título
  const loremText = document.createElement("p");
  loremText.classList.add("card-text", "mt-2");
  loremText.style.fontSize = "11pt";
  loremText.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada
  loremText.style.paddingLeft = "0rem"; // Aplicar la fuente personalizada

  loremText.innerHTML =
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl utaliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan";
  scrollContainer.appendChild(loremText);

  // Crear el contenedor para el ícono y el enlace
  const iconLinkContainer = document.createElement("div");
  iconLinkContainer.style.display = "flex";
  iconLinkContainer.style.alignItems = "center"; // Alinear verticalmente el icono y el enlace
  iconLinkContainer.style.justifyContent = "flex-start"; // Alinear a la izquierda

  // Crear el ícono
  const icon = document.createElement("img");
  icon.src = "img/icons/web.svg"; // Ruta del ícono PNG
  icon.alt = "Icono de acceso"; // Texto alternativo
  icon.style.height = "20px";
  iconLinkContainer.appendChild(icon); // Añadir el ícono al contenedor

  //console.log("Multi JSON data to populate", selectedBloc.trim());
  let prueba = selectedBloc.replace(/\s+/g, " ");
  //console.log("test ", prueba);

  // Crear el enlace de "Source"
  const blocSource = document.createElement("a");
  blocSource.classList.add("card-link");
  blocSource.href = multiJsonData.find((item) => item.blocName === prueba).link;

  blocSource.target = "_blank";
  // Aplicar estilos al enlace
  blocSource.style.textDecoration = "none"; // Eliminar el subrayado
  blocSource.style.fontSize = "11pt"; // Tamaño de fuente
  blocSource.style.marginLeft = "4px"; // Tamaño de fuente

  blocSource.style.color = "#0071BC"; // Cambiar color
  blocSource.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada

  blocSource.innerHTML = "View agreement";

  iconLinkContainer.appendChild(blocSource); // Añadir el enlace al contenedor

  // Añadir el contenedor de icono y enlace al contenedor principal
  scrollContainer.appendChild(iconLinkContainer);

  // Agregar el subtítulo "Participating Countries"
  const participatingCountriesTitle = document.createElement("p");
  participatingCountriesTitle.classList.add("card-text", "mt-0.3");
  participatingCountriesTitle.style.fontWeight = "bold"; // Poner en negrita
  participatingCountriesTitle.style.fontSize = "18pt"; // Tamaño de fuente
  participatingCountriesTitle.style.marginTop = "14pt"; // Tamaño de fuente
  participatingCountriesTitle.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada

  participatingCountriesTitle.innerHTML = "Participating Countries:";
  scrollContainer.appendChild(participatingCountriesTitle); // Añadir el subtítulo al contenedor con scroll

  // Crear un contenedor para los países con dos columnas
  const countriesContainer = document.createElement("div");
  countriesContainer.classList.add("d-flex", "flex-wrap"); // Usar flexbox para las columnas
  countriesContainer.style.fontFamily = "RalewayN"; // Aplicar la fuente personalizada

  // Dividir los países en dos columnas
  const column1 = document.createElement("div");
  column1.classList.add("w-50", "mb-2"); // La primera columna ocupará el 50% del ancho
  const column2 = document.createElement("div");
  column2.classList.add("w-50", "mb-2"); // La segunda columna también ocupará el 50%

  // Recorrer los países y agregarlos en las columnas
  blocCountries.forEach((country, index) => {
    const countryItem = document.createElement("p");
    countryItem.style.marginBottom = "0pt"; // Tamaño de fuente
    countryItem.style.fontSize = "11pt"; // Tamaño de fuente

    countryItem.innerHTML = `• ${country.properties.name}`; // Agregar un punto delante del nombre del país

    // Alternar columnas
    if (index % 2 === 0) {
      column1.appendChild(countryItem); // Agregar a la primera columna
    } else {
      column2.appendChild(countryItem); // Agregar a la segunda columna
    }
  });

  // Agregar las dos columnas al contenedor
  countriesContainer.appendChild(column1);
  countriesContainer.appendChild(column2);

  // Agregar el contenedor de países al contenedor con scroll
  scrollContainer.appendChild(countriesContainer);

  // Finalmente, agregar el contenedor con scroll al DOM
  infoMultiContainer.appendChild(scrollContainer);
}
export function clearCardContent() {
  const infoMultiContainer = document.querySelector(".card");

  if (infoMultiContainer) {
    infoMultiContainer.innerHTML = ""; // Elimina todo el contenido
  } else {
    ////console.warn("Elemento con clase 'card' no encontrado.");
  }
}
export function highlightBloc(
  svg,
  filteredGeoJSON,
  selectedColor,
  selectedBloc
) {
  //	svg.selectAll("text").remove();
  console.log("selected color", selectedColor);
  //console.log("Filtered geojson", filteredGeoJSON);
  const blocCountries = new Set(
    filteredGeoJSON.features.map((f) => f.properties.name)
  );
  //console.log("bloc countries are", blocCountries);

  svg.selectAll("path").attr("fill", (d) => {
    if (blocCountries.has(d.properties.name)) {
      return selectedColor; // Color para los países en blocCountries
    } else if (blocCountries.has(selectedBloc)) {
      // Otra condición adicional
      return "#000"; // Color alternativo
    } else {
      return "#f2f2f2"; // Color por defecto
    }
  });

  /* svg
    .selectAll("path")
    .attr("fill", (d) =>
      blocCountries.has(d.properties.name) ? selectedColor : "#f2f2f2"
    );*/
}

// export function highlightEuClubBloc(svg, filteredGeoJSON) {

// }
