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
import {
  addLegend,
  hideLegend,
} from "./modules/legendUtils.js";
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
  clearCardContent()
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
          "#F2F2F2",//0
          "#FEE2A4",//1
          "#FCCA7B",//2
          "#FCC12C",//3
          "#EA9B0F",//4
          "#D68F01",//5
          "#9E6604"//6
        ]);

      resetToInitialView(); // Inicializa el mapa

      document.querySelector(".main-select").addEventListener("click", resetToInitialView);

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
                highlightEu(svg, filteredCountryGeoJSON, item.textContent);
                deleteCountryLabels(filteredCountryGeoJSON);
                destroyMap();
                drawMap(mergedBiData, filteredCountryGeoJSON);
                highlightPartnership(svg, filteredCountryGeoJSON, item.textContent);

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
            drawMap(mergedBiData, filteredCountryGeoJSON);
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
              drawMap(mergedBiData, filteredGeoJSON);
              highlightBloc(svg, filteredGeoJSON, selectedColor);
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
    console.error("El botón con el ID 'toggleLabels' no se encontró en el DOM.");
  }
});

const buttons = document.querySelectorAll('.accordion-button2');

buttons.forEach(button => {
  button.addEventListener('click', function () {
    // Removemos la clase 'active' de todos los botones
    buttons.forEach(btn => btn.classList.remove('active'));

    // Añadimos la clase 'active' al botón que se hizo clic
    this.classList.add('active');
  });
});

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Previene el comportamiento por defecto (desplazamiento hacia arriba)
    // Si quieres realizar alguna acción adicional, como mostrar un contenido relacionado, puedes hacerlo aquí
  });
});

// Al hacer clic en "Bilateral partnerships", simulamos el clic en el primer botón de la lista "EU"
document.querySelector('.accordion-button2[data-bs-target="#flush-collapseOne"]').addEventListener('click', function () {
  const firstCountryButton = document.querySelector('.country-select');  // Selecciona el primer botón en la lista de "Bilateral partnerships"
  if (firstCountryButton) {
    firstCountryButton.classList.add('activeDetail');
    firstCountryButton.click();  // Simula un clic en ese botón
  }
});

// Al hacer clic en "Multilateral partnerships", simulamos el clic en el primer botón de la lista "BRICS Geological Platform"
document.querySelector('.accordion-button2[data-bs-target="#flush-collapseTwo"]').addEventListener('click', function () {
  const firstBlocButton = document.querySelector('.bloc-select');  // Selecciona el primer botón en la lista de "Multilateral partnerships"
  if (firstBlocButton) {
    firstBlocButton.classList.add('activeDetail');
    firstBlocButton.click();  // Simula un clic en ese botón
  }
});

const buttons2 = document.querySelectorAll('.list-group-item');

buttons2.forEach(button => {
  button.addEventListener('click', function () {
    buttons2.forEach(btn => btn.classList.remove('activeDetail'));
    this.classList.add('activeDetail');

  });
});
document.getElementById('zoomIn').addEventListener('mouseover', function () {
  const zoomInIcon = this.querySelector('img');

  // Cambiar el ícono de zoom-in al de activado (nuevo SVG)
  zoomInIcon.src = './img/icons/zoom-on.svg';
});

document.getElementById('zoomOut').addEventListener('mouseover', function () {
  const zoomOutIcon = this.querySelector('img');
  // Cambiar el ícono de zoom-out al de activado (nuevo SVG)
  zoomOutIcon.src = './img/icons/zoom-out-on.svg';
});

document.getElementById('zoomOut').addEventListener('mouseout', function () {
  const zoomOutIcon = this.querySelector('img');
  zoomOutIcon.src = './img/icons/zoom-out-off.svg';

});
document.getElementById('zoomIn').addEventListener('mouseout', function () {
  const zoomInIcon = this.querySelector('img');

  // Cambiar el ícono de zoom-in al de activado (nuevo SVG)
  zoomInIcon.src = './img/icons/zoom-off.svg';

});

document.getElementById('printPage').addEventListener('click', function () {
  printDiv('#printable');
});
function printDiv(divId) {
  console.log("Generando impresión...");

  // Verificar si el div existe
  var divElement = document.querySelector(divId);
  if (!divElement) {
    console.error("Elemento no encontrado: " + divId);
    return;
  }

  html2canvas(divElement).then(function (canvas) {
    // Crear una imagen a partir del canvas
    var imgData = canvas.toDataURL('image/png');

    // Crear un nuevo documento de impresión
    var windowContent = `
          <!DOCTYPE html>
          <html>
          <head>
              <title> </title>
          </head>
          <body style="margin: 0; text-align: center;">
              <img src="${imgData}" style="max-width: 100%; height: auto;" />
          </body>
          </html>
      `;

    // Abrir la ventana de impresión
    var printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      console.error("No se pudo abrir la ventana de impresión. Puede estar bloqueada por el navegador.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(windowContent);
    printWindow.document.close();

    // Esperar a que se cargue la imagen antes de imprimir
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  }).catch(function (error) {
    console.error("Error al generar el canvas:", error);
  });
}