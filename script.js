// URL pública de tu Google Sheets
const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnm5Is_2Za4GD-1UUWr8Nv6Aq_91JZNm3sJmPkrJLr30tfQBt4EhpR_dhjRc32CC2-zBbIODpi2j5O/pub?output=csv';

// Identificar limpieza activa hoy
function getLimpiezaActiva(data) {
  const hoy = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
  return data.find(
    limpieza => limpieza.fecha_in <= hoy && limpieza.fecha_out >= hoy
  );
}

// Mostrar datos en la página
function showData(data) {
  const limpiezaData = getLimpiezaActiva(data.Limpieza);

  if (!limpiezaData) {
    document.getElementById("info-limpieza").textContent =
      "No hay limpiezas activas hoy.";
    return;
  }

  // Mostrar información de la limpieza
  document.getElementById("info-limpieza").textContent = `
    ID: ${limpiezaData.id_limpieza}, Inicio: ${limpiezaData.fecha_in}, Fin: ${limpiezaData.fecha_out}
  `;

  // Buscar ducto asociado
  const ductoData = data.Ducto.find(
    ducto => ducto.id_ducto === limpiezaData.id_ducto
  );

  document.getElementById("info-ducto").textContent = `
    Ducto: ${ductoData.nombre} (ID: ${ductoData.id_ducto})
  `;

  // Mostrar checkpoints
  const puntosData = data.Puntos.filter(
    punto => punto.id_ducto === limpiezaData.id_ducto
  );

  const tabla = document.getElementById("tabla-puntos");
  puntosData.forEach(punto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${punto.progresiva}</td>
      <td>${punto.coordenadas}</td>
      <td>${punto.hora || "Pendiente"}</td>
    `;
    tabla.appendChild(fila);
  });
}

// Conectar Tabletop.js
function init() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    simpleSheet: false, // Para trabajar con múltiples pestañas
    callback: showData,
  });
}

// Ejecutar al cargar la página
window.addEventListener("DOMContentLoaded", init);
