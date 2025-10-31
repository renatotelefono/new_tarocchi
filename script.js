let mazzo = [];
let selezionate = [];

/* === Inizializza il mazzo === */
function inizializzaCarte() {
  const nomi = [
    "00_il_matto","01_il_mago","02_la_papessa","03_l_imperatrice","04_l_imperatore",
    "05_il_papa","06_gli_amanti","07_il_carro","08_la_forza","09_l_eremita",
    "10_la_ruota_della_fortuna","11_la_giustizia","12_l_appeso","13_la_morte",
    "14_la_temperanza","15_il_diavolo","16_la_torre","17_la_stella","18_la_luna",
    "19_il_sole","20_il_giudizio","21_il_mondo"
  ];

  mazzo = nomi.map((nome, i) => ({
    id: i,
    nome,
    dritta: Math.random() < 0.5,
    img: `asset/img_it/${nome}.jpeg`
  }));

  renderCarteCoperte();
}

/* === Render delle 22 carte in 4  righe (6, 6, 6, 4) === */
function renderCarteCoperte() {
  const container = document.getElementById("mazzo");
  container.innerHTML = "";

  const distribuzione = [6, 6, 6, 4];
  let index = 0;

  distribuzione.forEach(qta => {
    const riga = document.createElement("div");
    riga.className = "riga-carte";
    for (let i = 0; i < qta; i++) {
      const carta = mazzo[index];
      const img = document.createElement("img");
      img.src = "asset/dorso.jpeg";
      img.className = "carta";
      img.dataset.index = index;
      img.addEventListener("click", onCartaClick);
      riga.appendChild(img);
      index++;
    }
    container.appendChild(riga);
  });
}

/* === Gestione click === */
function onCartaClick(e) {
  const index = parseInt(e.target.dataset.index);
  selezionaCarta(index);
}

/* === Effetto "impila sulla prima" === */
function mescolaCarte() {
  const container = document.getElementById("mazzo");
  const carte = Array.from(container.querySelectorAll("img"));

  // logica del mazzo (mescola)
  mazzo.forEach(c => (c.dritta = Math.random() < 0.5));
  mazzo.sort(() => Math.random() - 0.5);

  // calcolo posizione della prima carta come punto di riferimento
  const primaCarta = carte[0];
  if (!primaCarta) return;

  const rectBase = primaCarta.getBoundingClientRect();

  // trasformiamo tutte le carte in posizione assoluta
  carte.forEach(img => {
    const rect = img.getBoundingClientRect();
    const dx = rectBase.left - rect.left;
    const dy = rectBase.top - rect.top;
    img.style.transform = `translate(${dx}px, ${dy}px)`;
    img.style.zIndex = 10;
  });

  // dopo 1.5s: ridistribuzione visiva
  setTimeout(() => {
    container.classList.add("ridistribuita");
    renderCarteCoperte();
  }, 1500);
}

/* === Selezione carta === */
function selezionaCarta(index) {
  if (selezionate.length >= 3) return;

  const carta = mazzo[index];
  selezionate.push(carta);

  const slotId = ["passato", "presente", "futuro"][selezionate.length - 1];
  const slot = document.getElementById(slotId);

  const img = document.createElement("img");
  img.src = carta.img;
  img.className = "carta-scoperta";
  if (!carta.dritta) img.style.transform = "rotate(180deg)";
  slot.innerHTML = "";
  slot.appendChild(img);

  if (selezionate.length === 3) {
    document.getElementById("btnInterpretazione").disabled = false;
  }
}

/* === Interpretazione === */
function interpreta() {
  sessionStorage.setItem("lettura", JSON.stringify({
    passato: selezionate[0],
    presente: selezionate[1],
    futuro: selezionate[2]
  }));
  window.location.href = "interpretazione.html";
}

/* === Reset === */
function reset() {
  selezionate = [];
  ["passato", "presente", "futuro"].forEach(id => {
    const slot = document.getElementById(id);
    slot.innerHTML = `<h3>${id.charAt(0).toUpperCase() + id.slice(1)}</h3>`;
  });
  document.getElementById("btnInterpretazione").disabled = true;
  renderCarteCoperte();
}

/* === Avvio === */
window.addEventListener("DOMContentLoaded", inizializzaCarte);
