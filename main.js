import {
  loadAndMergeData,
  mergeMulti,
  createBlocGeoJSON,
  filterAfrica,
  filterCountriesByPartner,
  filterEUandPartners,
} from "./modules/dataUtils.js";
import {
  path,
  drawMap,
  drawMapWithPartnerColors,
  destroyMap,
  handleSelection,
  addCountryLabels,
  deleteCountryLabels,
  zoomIn,
  zoomOut,
} from "./modules/mapUtils.js";
import {
  toggleButton,
  highlightPartnership,
  updateLabel,
  populatePartnerships,
  populateMultilateral,
  highlightBloc,
  highlightEu,
  clearCardContent,
} from "./modules/selectionUtils.js";
import { addLegend, hideLegend } from "./modules/legendUtils.js";
import {
  svg,
  customColors,
  blocColors,
  geojsonUrl,
  jsonFilePath,
  multiJsonFilePath,
  noPartnerFilePath,
} from "./modules/globals.js";
import { showThirdColumn, removeThirdColumn } from "./modules/layout.js";

let partnerMap = {};
let multilateralMap = {};
let filteredGeoJSON;
let mergedBiData; // Para referencia global
let numberData; // Para referencia global
let colorScale; // Para referencia global

// Tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background", "#fff")
  .style("border", ".5px solid #ddd")
  .style("border-radius", "3px")
  .style("padding", "5px")
  .style("font-size", "12px")
  .style("opacity", 0);

// Función para restablecer el mapa a su estado inicial
function resetToInitialView() {
  destroyMap();
  filteredGeoJSON = filterAfrica(mergedBiData, numberData); // Filtra África
  drawMapWithPartnerColors(svg, path, filteredGeoJSON, numberData); // Dibuja el mapa inicial
  clearCardContent();
  addLegend(svg, colorScale); // Añade la leyenda
  removeThirdColumn(); // Oculta la tercera columna
}
function refresh() {
  window.location.href = window.location.href;
}
// Load and merge data
Promise.all([
  loadAndMergeData(geojsonUrl, jsonFilePath, noPartnerFilePath),
  mergeMulti(geojsonUrl, multiJsonFilePath),
])
  .then(([bilateralData, multiData]) => {
    if (bilateralData && multiData) {
      mergedBiData = bilateralData.geojsonData;
      const biData = bilateralData.jsonData;
      numberData = bilateralData.nojsonData;
      const multiGeoData = multiData.geojsonMultiData;
      const multiJsonData = multiData.multiJsonData;

      mergedBiData.features.forEach((feature) => {
        const country = feature.properties.name;
        if (feature.properties.partners) {
          feature.properties.partners.forEach((partner) => {
            if (!partnerMap[country]) {
              partnerMap[country] = [];
            }
            partnerMap[country].push(partner);
          });
        }
      });

      multiGeoData.features.forEach((bloc) => {
        const blocName = bloc.properties.blocs;
        blocName.forEach((name) => {
          if (!multilateralMap[name]) {
            multilateralMap[name] = [];
          }
          bloc.properties.blocs.forEach((member) => {
            if (!multilateralMap[name].includes(member)) {
              multilateralMap[name].push(member);
            }
          });
        });
      });

      colorScale = d3
        .scaleQuantize()
        .domain([0, d3.max(numberData, (d) => d.partnersNo)])
        .range([
          "#F2F2F2", //0
          "#FEE2A4", //1
          "#FCCA7B", //2
          "#FCC12C", //3
          "#EA9B0F", //4
          "#D68F01", //5
          "#9E6604", //6
        ]);

      resetToInitialView(); // Inicializa el mapa

      document
        .querySelector(".main-select")
        .addEventListener("click", resetToInitialView);

      document.querySelectorAll(".country-select").forEach((item) => {
        item.addEventListener("click", function () {
          showThirdColumn();
          toggleButton(this);
          handleSelection("bilateral", item.textContent);
          const selectedCountry = this.textContent.trim();
          //  console.log(filteredCountryGeoJSON)
          if (item.textContent.includes("EU")) {
            filterEUandPartners(mergedBiData, biData).then(
              (filteredCountryGeoJSON) => {
                deleteCountryLabels(filteredCountryGeoJSON);
                destroyMap();
                drawMap(mergedBiData, filteredCountryGeoJSON, "EU");
                highlightEu(svg, filteredCountryGeoJSON);

                /* highlightPartnership(
                  svg,
                  filteredCountryGeoJSON,
                  item.textContent
                );*/

                const toggleButton = document.getElementById("toggleLabels");
                toggleButton.classList.remove("active");

                //updateLabel(svg, path, filteredCountryGeoJSON);

                populatePartnerships(biData, selectedCountry);
              }
            );
          } else {
            const filteredCountryGeoJSON = filterCountriesByPartner(
              mergedBiData,
              selectedCountry
            );

            deleteCountryLabels(filteredCountryGeoJSON);
            destroyMap();
            drawMap(mergedBiData, filteredCountryGeoJSON, item.textContent);
            highlightPartnership(svg, filteredCountryGeoJSON, item.textContent);
            const toggleButton = document.getElementById("toggleLabels");
            toggleButton.classList.remove("active");
            //updateLabel(svg, path, filteredCountryGeoJSON);

            populatePartnerships(biData, selectedCountry);
            hideLegend();
          }
        });
      });

      document.querySelectorAll(".bloc-select").forEach((item) => {
        item.addEventListener("click", function () {
          showThirdColumn();
          handleSelection("multilateral", item.textContent);
          const selectedBloc = this.textContent.trim();
          const selectedColor = blocColors[selectedBloc] || "#ccc";
          createBlocGeoJSON(geojsonUrl, multiJsonFilePath, selectedBloc)
            .then((filteredGeoJSON) => {
              deleteCountryLabels(filteredGeoJSON);
              destroyMap();
              drawMap(mergedBiData, filteredGeoJSON, selectedBloc);
              highlightBloc(svg, filteredGeoJSON, selectedColor, selectedBloc);
              const toggleButton = document.getElementById("toggleLabels");
              toggleButton.classList.remove("active");
              populateMultilateral(
                filteredGeoJSON,
                selectedBloc,
                multiJsonData
              );
              hideLegend();
            })
            .catch((error) =>
              console.error("Error processing filtered GeoJSON:", error)
            );
        });
      });
    }
  })
  .catch((error) => console.error("Error processing data:", error));

// --- NUEVO CÓDIGO PARA ZOOM Y MOSTRAR NOMBRES DE PAÍSES --- //

document.getElementById("zoomIn").addEventListener("click", () => {
  zoomIn();
});
document.getElementById("zoomOut").addEventListener("click", () => zoomOut());
document.getElementById("africaButton").addEventListener("click", refresh);

// Mostrar/ocultar nombres de países
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleLabels");
  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      this.classList.toggle("active");
      const showLabels = this.classList.contains("active");
      if (showLabels) {
        addCountryLabels(filteredGeoJSON);
      } else {
        deleteCountryLabels(filteredGeoJSON);
      }
    });
  } else {
    console.error(
      "El botón con el ID 'toggleLabels' no se encontró en el DOM."
    );
  }
});

const buttons = document.querySelectorAll(".accordion-button2");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Removemos la clase 'active' de todos los botones
    buttons.forEach((btn) => btn.classList.remove("active"));

    // Añadimos la clase 'active' al botón que se hizo clic
    this.classList.add("active");
  });
});
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Previene el comportamiento por defecto (desplazamiento hacia arriba)
    // Si quieres realizar alguna acción adicional, como mostrar un contenido relacionado, puedes hacerlo aquí
  });
});

// Al hacer clic en "Bilateral partnerships", simulamos el clic en el primer botón de la lista "EU"
document
  .querySelector('.accordion-button2[data-bs-target="#flush-collapseOne"]')
  .addEventListener("click", function () {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // El usuario está en un dispositivo móvil
      showPickerBilateral();
      const selectedText = document.getElementById("blockName");
      selectedText.innerText = "Bilateral Parnerships";
    } else {
      // El usuario está en una web (escritorio o tablet)
      const firstCountryButton = document.querySelector(".country-select"); // Selecciona el primer botón en la lista de "Bilateral partnerships"
      if (firstCountryButton) {
        firstCountryButton.classList.add("activeDetail");
        firstCountryButton.click(); // Simula un clic en ese botón
      }
    }
  });

// Al hacer clic en "Multilateral partnerships", simulamos el clic en el primer botón de la lista "BRICS Geological Platform"
document
  .querySelector('.accordion-button2[data-bs-target="#flush-collapseTwo"]')
  .addEventListener("click", function () {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // El usuario está en un dispositivo móvil
      showPickerMultilateral();
      const selectedText = document.getElementById("blockName");
      selectedText.innerText = "Multilateral Parnerships";
    } else {
      const firstBlocButton = document.querySelector(".bloc-select"); // Selecciona el primer botón en la lista de "Multilateral partnerships"
      if (firstBlocButton) {
        firstBlocButton.classList.add("activeDetail");
        firstBlocButton.click(); // Simula un clic en ese botón
      }
    }
  });

const buttons2 = document.querySelectorAll(".list-group-item");

buttons2.forEach((button) => {
  button.addEventListener("click", function () {
    buttons2.forEach((btn) => btn.classList.remove("activeDetail"));

    this.classList.add("activeDetail");
  });
});

document.getElementById("zoomIn").addEventListener("mouseover", function () {
  const zoomInIcon = this.querySelector("img");

  // Cambiar el ícono de zoom-in al de activado (nuevo SVG)
  zoomInIcon.src = "./img/icons/zoom-on.svg";
});

document.getElementById("zoomOut").addEventListener("mouseover", function () {
  const zoomOutIcon = this.querySelector("img");
  // Cambiar el ícono de zoom-out al de activado (nuevo SVG)
  zoomOutIcon.src = "./img/icons/zoom-out-on.svg";
});

document.getElementById("zoomOut").addEventListener("mouseout", function () {
  const zoomOutIcon = this.querySelector("img");
  zoomOutIcon.src = "./img/icons/zoom-out-off.svg";
});
document.getElementById("zoomIn").addEventListener("mouseout", function () {
  const zoomInIcon = this.querySelector("img");

  // Cambiar el ícono de zoom-in al de activado (nuevo SVG)
  zoomInIcon.src = "./img/icons/zoom-off.svg";
});

document.getElementById("printPage").addEventListener("click", function () {
  printDiv("#printable");
});
function printDiv(divId) {
  console.log("Generando impresión...");

  // Verificar si el div existe
  var divElement = document.querySelector(divId);
  if (!divElement) {
    console.error("Elemento no encontrado: " + divId);
    return;
  }

  // Usar html2canvas para generar el canvas
  html2canvas(divElement)
    .then(function (canvas) {
      // Crear una imagen a partir del canvas
      var imgData = canvas.toDataURL("image/png");

      // Crear un iframe oculto para imprimir
      var iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.top = "-10000px"; // Ocultar fuera de la pantalla
      document.body.appendChild(iframe);

      var iframeWindow = iframe.contentWindow || iframe.contentDocument;
      var iframeDoc = iframeWindow.document || iframe.contentDocument;

      // Pasar la imagen generada al iframe
      iframeDoc.open();
      iframeDoc.write(`
		<!DOCTYPE html>
		<html>
		<head>
		  <title>Mind the Map: Charting Africa’s Critical Mineral Partnerships</title> <!-- Título vacío para que no aparezca en la impresión -->
		  <style>
			@page {
			  margin: 0; /* Elimina los márgenes de la página */
			  size: landscape; /* Forzar orientación landscape */

			}
			body {
			  margin: 0; 
			  display: flex;
			  justify-content: center;
			  align-items: center;
			  height: 100vh;
			  overflow: hidden;
			
			}
			img {
			  max-width: 100%;
			  max-height: 100%;
			}
		  </style>
		</head>
		<body>
		  <img src="${imgData}" alt="Contenido a imprimir" />
		</body>
		</html>
	  `);
      iframeDoc.close();

      // Esperar a que el contenido cargue antes de imprimir
      iframe.onload = function () {
        iframeWindow.focus();
        iframeWindow.print();
        document.body.removeChild(iframe); // Eliminar el iframe después de imprimir
      };
    })
    .catch(function (error) {
      console.error("Error al generar el canvas:", error);
    });
}
if (window.innerWidth <= 768) {
  // Contamos las palabras del texto
  const descriptionText = document.getElementById("descriptionText");
  const words = descriptionText.innerText.split(" ");

  // Encontramos la primera parte del texto y lo separamos
  const firstPart = words.slice(0, 33).join(" ") + "..."; // Agregamos '...' al final de las primeras 33 palabras
  const secondPart = words.slice(33).join(" ");

  // Creamos el botón
  const button = document.createElement("button");
  button.id = "toggleDescription";
  button.textContent = " Read more";

  // Insertamos el texto inicial con el botón
  descriptionText.innerHTML = firstPart;
  descriptionText.appendChild(button);

  // Función para alternar entre mostrar más o menos texto
  function toggleText() {
    if (button.textContent === " Read more") {
      // Mostrar todo el texto sin los tres puntos y cambiar el texto del botón a "Show less"
      descriptionText.innerHTML = firstPart.slice(0, -3) + " " + secondPart; // Eliminar los '...' de firstPart
      descriptionText.appendChild(button);
      button.textContent = " Show less";
    } else {
      // Mostrar solo la primera parte con '...' y cambiar el texto del botón a "Read more"
      descriptionText.innerHTML = firstPart;
      descriptionText.appendChild(button);
      button.textContent = " Read more";
    }
  }

  // Añadimos el evento de alternar el texto y el texto del botón al hacer clic
  button.addEventListener("click", toggleText);
}

window.addEventListener("resize", changeButtonText);
window.addEventListener("load", changeButtonText);

function changeButtonText() {
  const buttons = document.querySelectorAll(".accordion-button2");
  buttons.forEach((button) => {
    // Buscar solo el texto del botón, ignorando las imágenes
    const buttonTextNode = Array.from(button.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );

    if (window.innerWidth <= 768) {
      if (button.id === "africaButton") {
        buttonTextNode.nodeValue = "Overview"; // Cambiar solo el texto
      } else if (button.id === "clickable") {
        buttonTextNode.nodeValue = "Bilateral";
      } else if (button.id === "multilateral") {
        buttonTextNode.nodeValue = "Multilateral";
      }
    } else {
      if (button.id === "africaButton") {
        buttonTextNode.nodeValue = "African countries overview";
      } else if (button.id === "clickable") {
        buttonTextNode.nodeValue = "Bilateral partnerships";
      } else if (button.id === "multilateral") {
        buttonTextNode.nodeValue = "Multilateral partnerships";
      }
    }
  });
}
