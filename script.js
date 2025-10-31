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

  // Aggiorna l’orientamento casuale e mescola il mazzo
  mazzo.forEach(c => (c.dritta = Math.random() < 0.5));
  mazzo.sort(() => Math.random() - 0.5);

  // Seleziona la prima carta come punto di riferimento per l’effetto “impila”
  const primaCarta = carte[0];
  if (!primaCarta) return;
  const rectBase = primaCarta.getBoundingClientRect();

  // Anima lo spostamento delle carte sopra la prima
  carte.forEach(img => {
    const rect = img.getBoundingClientRect();
    const dx = rectBase.left - rect.left;
    const dy = rectBase.top - rect.top;
    img.style.transform = `translate(${dx}px, ${dy}px)`;
    img.style.transition = "transform 0.6s ease";
    img.style.zIndex = 10;
  });

  // Dopo 1 secondo, ridistribuisce le carte
  setTimeout(() => {
    renderCarteCoperte();

    // 🔮 Disattiva visivamente le carte già selezionate
    const tutteLeCarte = document.querySelectorAll("#mazzo img");
    selezionate.forEach(sel => {
      const index = mazzo.findIndex(c => c.nome === sel.nome);
      if (index >= 0 && tutteLeCarte[index]) {
        tutteLeCarte[index].style.pointerEvents = "none";
        tutteLeCarte[index].style.opacity = "0.4";
        tutteLeCarte[index].style.filter = "grayscale(100%)";
      }
    });
  }, 1000);
}


/* === Selezione carta === */
function selezionaCarta(index) {
  if (selezionate.length >= 3) return;

  const carta = mazzo[index];

  // Disabilita la carta selezionata (non più cliccabile)
  const imgSelezionata = document.querySelectorAll("#mazzo img")[index];
  imgSelezionata.style.pointerEvents = "none";
  imgSelezionata.style.opacity = "0.5";

  selezionate.push(carta);

  const slotId = ["passato", "presente", "futuro"][selezionate.length - 1];
  const slot = document.getElementById(slotId);
  const img = document.createElement("img");
  img.src = carta.img;
  img.className = "carta-scoperta";
  if (!carta.dritta) img.style.transform = "rotate(180deg)";
  slot.innerHTML = `<h3>${slot.querySelector("h3").textContent}</h3>`;
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
/* === Reset === */
function reset() {
  // Cancella lo stato delle selezioni
  selezionate = [];
  sessionStorage.removeItem("lettura");
  sessionStorage.removeItem("pdfAbilitato");

  // Ripulisce gli slot
  ["passato", "presente", "futuro"].forEach(id => {
    const slot = document.getElementById(id);
    slot.innerHTML = `<h3>${id.charAt(0).toUpperCase() + id.slice(1)}</h3>`;
  });

  // Disabilita i pulsanti
  const btnInterp = document.getElementById("btnInterpretazione");
  if (btnInterp) btnInterp.disabled = true;
  const btnPdf = document.getElementById("btnPdf");
  if (btnPdf) btnPdf.disabled = true;

  // Cancella il contenitore e rigenera tutte le carte coperte
  const container = document.getElementById("mazzo");
  container.innerHTML = "";

  // Reinzializza completamente il mazzo e rende tutte le carte cliccabili
  inizializzaCarte();

  // Dopo il render, assicurati che tutte le carte siano attive
  setTimeout(() => {
    const tutteLeCarte = document.querySelectorAll("#mazzo img");
    tutteLeCarte.forEach(img => {
      img.style.pointerEvents = "auto";
      img.style.opacity = "1";
      img.style.filter = "none";
    });
  }, 300);
}

/* === Avvio === */
window.addEventListener("DOMContentLoaded", () => {
  inizializzaCarte();
});




