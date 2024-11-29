const Bilateral = [
  { text: "EU", value: 1, disabled: false },
  { text: "Saudi Arabia", value: 2, disabled: false },
  { text: "United Arab Emirates", value: 3, disabled: false },
  { text: "India", value: 4, disabled: false },
  { text: "South Korea", value: 5, disabled: false },
  { text: "Japan", value: 6, disabled: false },
  { text: "China", value: 7, disabled: false },
  { text: "Indonesia", value: 8, disabled: false },
  { text: "Russia", value: 9, disabled: false },
  { text: "USA", value: 10, disabled: false },
  { text: "Turkey", value: 11, disabled: false },
];

const Multilateral = [
	{ text: "BRICS Geological Platform", value: 1, disabled: false },
	{ text: "Minerals Security Partnership", value: 2, disabled: false },
	{ text: "EU Raw Materials Club", value: 3, disabled: false },
	{ text: "Energy Resource Governance Initiative", value: 4, disabled: false },
	{ text: "IPEF Critical Minerals Dialogue", value: 5, disabled: false },
	{ text: "Sustainable Critical Mineral Alliance", value: 6, disabled: false },
	{ text: "Conference on Critical Materials and Minerals", value: 7, disabled: false },
	{ text: "France-Germany-Italy Joint Communique on Critical Raw Materials", value: 8, disabled: false },
	{ text: "Critical Minerals Mapping Initiative", value: 9, disabled: false },
	{ text: "Lobito Corridor Project", value: 10, disabled: false },
  ];
const AfricanOverview = [
  { text: "None - overview", value: 0, disabled: false },
  { text: "Algeria", value: 1, disabled: false },
  { text: "Angola", value: 2, disabled: false },
  { text: "Chad", value: 3, disabled: false },
  { text: "Democratic Republic of the Congo", value: 4, disabled: false },
  { text: "Ivory Coast", value: 5, disabled: false },
  { text: "Ethiopia", value: 6, disabled: false },
  { text: "Guinea", value: 7, disabled: false },
  { text: "Guinea Bissau", value: 8, disabled: false },
  { text: "Kenya", value: 9, disabled: false },
  { text: "Libya", value: 10, disabled: false },
  { text: "Madagascar", value: 11, disabled: false },
  { text: "Malawi", value: 12, disabled: false },
  { text: "Mali", value: 13, disabled: false },
  { text: "Morocco", value: 14, disabled: false },
  { text: "Mozambique", value: 15, disabled: false },
  { text: "Namibia", value: 16, disabled: false },
  { text: "Niger", value: 17, disabled: false },
  { text: "Nigeria", value: 18, disabled: false },
  { text: "Rwanda", value: 19, disabled: false },
  { text: "Senegal", value: 20, disabled: false },
  { text: "Somalia", value: 21, disabled: false },
  { text: "South Africa", value: 22, disabled: false },
  { text: "Sudan", value: 23, disabled: false },
  { text: "United Republic of Tanzania", value: 24, disabled: false },
  { text: "Uganda", value: 25, disabled: false },
  { text: "Zambia", value: 26, disabled: false },
  { text: "Zimbabwe", value: 27, disabled: false },
];
let selectedIndex = 0;
let pickerData;
let wheelList = document.getElementById("wheelList");

const picker = document.getElementById("picker");
const selectedText = document.getElementById("selectedText");
const selectedAfrican = document.getElementById("africanCountry");
const blockNameTemp = document.getElementById("blockNameTemp");
const blockNameNowTemp = document.getElementById("blockNameNowTemp");

function showPickerAfrica() {
  picker.style.display = "block";
  pickerData = AfricanOverview;
  createWheel();
}
function showPickerBilateral() {
  picker.style.display = "block";
  pickerData = Bilateral;
  createWheel();
}
function showPickerMultilateral() {
  picker.style.display = "block";
  pickerData = Multilateral;
  createWheel();
}

function cancelPicker(event) {
  if (event.target !== picker) return;
  picker.style.display = "none";
}
function cancel() {
  picker.style.display = "none";
}

function confirmPicker() {
  picker.style.display = "none";
  selectedText.innerText = pickerData[selectedIndex].text;
  selectedAfrican.innerText = pickerData[selectedIndex].text;

  const showScrollable = document.getElementById("showScrollable");
  showScrollable.classList.add("hidden");

  ////console.log(showtooltip);

  // showtooltip.style.display="none"

  //console.log(blockNameNowTemp);
  blockNameTemp.innerText = blockNameNowTemp.textContent.trim();

  //console.log(selectedText.innerText);
  //---------------------------Multilateral
  const button = Array.from(document.querySelectorAll(".bloc-select")).find(
    (button) => {
      // //console.log(button.textContent + " no parece " + selectedText.innerText); // Esto imprimirá el botón en cada iteración
      return button.textContent.trim() === selectedText.innerText;
    }
  );

  if (button) {
    button.click(); // Simula un clic en ese botón
  } else {
    //console.log("Botón no encontrado");
  }
  //---------------------------Bilateral
  const button2 = Array.from(document.querySelectorAll(".country-select")).find(
    (button) => {
      //  //console.log(button.textContent + " no parece " + selectedText.innerText); // Esto imprimirá el botón en cada iteración
      return button.textContent.trim() === selectedText.innerText;
    }
  );

  if (button2) {
    button2.click(); // Simula un clic en ese botón
  } else {
    //console.log("Botón no encontrado");
  }

  /*
  const firstBlocButton = document.querySelector(".bloc-select"); // Selecciona el primer botón en la lista de "Multilateral partnerships"
  //console.log(firstBlocButton);

  if (firstBlocButton) {
    firstBlocButton.classList.add("activeDetail");
    firstBlocButton.click(); // Simula un clic en ese botón
  }*/
}

function createWheel() {
  wheelList.innerHTML = ""; // Clear previous items
  pickerData.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.text;
    li.className = item.disabled
      ? "wheel-item wheel-disabled-item"
      : "wheel-item";
    if (index === selectedIndex) li.classList.add("selected-item"); // Highlight selected
    li.onclick = () => selectItem(index);
    wheelList.appendChild(li);
  });

  // Scroll to the selected item
  wheelList.scrollTop = selectedIndex * 36;
}

function selectItem(index) {
  // Remove styles from the previously selected item
  const previousSelected = wheelList.querySelector(".selected-item");
  if (previousSelected) {
    previousSelected.classList.remove("selected-item");
  }

  // Apply styles to the new selected item
  selectedIndex = index;
  const newSelected = wheelList.children[selectedIndex];
  newSelected.classList.add("selected-item");

  // Update displayed text
  selectedText.innerText = pickerData[selectedIndex].text;
  wheelList.scrollTop = selectedIndex * 36;
}

// Scroll functionality remains the same
let isDragging = false;
let startMouseY = 0;

wheelList.addEventListener("mousedown", (e) => {
  isDragging = true;
  startMouseY = e.pageY;
});

wheelList.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  let moveDistance = startMouseY - e.pageY;
  wheelList.scrollTop += moveDistance;
  startMouseY = e.pageY;
});

wheelList.addEventListener("mouseup", () => {
  isDragging = false;
});

wheelList.addEventListener("mouseleave", () => {
  isDragging = false;
});

let isTouching = false;
let startTouchY = 0;

wheelList.addEventListener("touchstart", (e) => {
  isTouching = true;
  startTouchY = e.touches[0].pageY;
});

wheelList.addEventListener("touchmove", (e) => {
  if (!isTouching) return;

  const moveDistance = startTouchY - e.touches[0].pageY;
  wheelList.scrollTop += moveDistance;
  startTouchY = e.touches[0].pageY;

  if (wheelList.scrollHeight > wheelList.clientHeight) {
    e.preventDefault();
  }
});

wheelList.addEventListener("touchend", () => {
  isTouching = false;
});


