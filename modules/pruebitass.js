     // Crear el subtítulo de "Areas of Cooperation"
	 const areasTitle = document.createElement("h1");
	 areasTitle.classList.add("card-text");
	 //areasTitle.style.fontWeight = "bold"; // Poner el texto en negrita
	 areasTitle.style.fontFamily = "RalewayLight"; // Aplicar la fuente personalizada
	 areasTitle.style.fontSize = "11pt"; // Aplicar la fuente personalizada
	 areasTitle.style.paddingBottom = "0px"; // Aplicar la fuente personalizada
	 areasTitle.style.marginBottom = "0px"; // Aplicar la fuente personalizada

	 areasTitle.innerHTML = "Areas of Cooperation:";
	 partnershipCard.appendChild(areasTitle);

	 // Contenedor de tags
	 const tagsContainer = document.createElement("div");
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