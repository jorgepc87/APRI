const STATE_HIDE = 0;
const STATE_SHOW = 1;
let state = STATE_HIDE;
let wheel = null;
let selectedIndex = 2;
let pickerData = [
  { text: 'Venomancer', value: 1, disabled: true },
  { text: 'Nerubian Weaver', value: 2 },
  { text: 'Spectre', value: 3 },
  { text: 'Juggernaut', value: 4 },
  { text: 'Karl', value: 5 },
  { text: 'Zeus', value: 6 },
  { text: 'Witch Doctor', value: 7 },
  { text: 'Lich', value: 8 },
  { text: 'Oracle', value: 9 },
  { text: 'Earthshaker', value: 10 }
];

// Mostrar Picker
function showPicker() {
  if (state === STATE_SHOW) return;
	console.log("prueba")
  state = STATE_SHOW;
  const picker = document.getElementById("picker");
  picker.style.display = "block";

  if (!wheel) {
	console.log("prueba")

    setTimeout(() => {
      const wheelWrapper = document.getElementById("wheelWrapper").children[0];
      createWheel(wheelWrapper);
    }, 0);
  }
}

// Ocultar Picker
function hidePicker() {
  state = STATE_HIDE;
  const picker = document.getElementById("picker");
  picker.style.display = "none";
}

// Confirmar selección
function confirmPicker() {
  wheel.stop();
  const currentSelectedIndex = wheel.getSelectedIndex();
  selectedIndex = currentSelectedIndex;
  const selectedText = pickerData[currentSelectedIndex].text;
  document.getElementById("selectedText").innerText = selectedText;
  hidePicker();
}

// Cancelar selección
function cancelPicker(event) {
  event?.stopPropagation();
  wheel.restorePosition();
  hidePicker();
}

// Crear la rueda
function createWheel(wheelWrapper) {
	console.log(wheelWrapper)

  if (!wheel) {
    populateWheel();
    wheel = new BScroll(wheelWrapper, {
      wheel: {
        selectedIndex: selectedIndex,
        wheelWrapperClass: "wheel-scroll",
        wheelItemClass: "wheel-item",
        wheelDisabledItemClass: "wheel-disabled-item"
      },
      useTransition: false,
      probeType: 3
    });
  } else {
    wheel.refresh();
  }
}

// Generar los ítems en la rueda
function populateWheel() {
  const wheelScroll = document.getElementById("wheelScroll");
  wheelScroll.innerHTML = pickerData
    .map(
      (item, index) =>
        `<li class="wheel-item ${
          item.disabled ? "wheel-disabled-item" : ""
        }" data-index="${index}">${item.text}</li>`
    )
    .join("");
}