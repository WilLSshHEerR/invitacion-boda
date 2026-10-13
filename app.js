/* =====================================================================
   Invitación Bodas de Oro · José & Noemí
   Todo lo editable está en esta primera parte (CONFIGURACIÓN).
   ===================================================================== */

/* ---------- CONFIGURACIÓN ---------- */

// Firebase: pega aquí los datos de tu proyecto (Configuración del proyecto > Tus apps > Web).
// Mientras apiKey esté vacío se usa la lista local de ejemplo + WhatsApp.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const EVENTO = {
  nombres: "José & Noemí",
  fechaTexto: "SÁB | 6 DE FEBRERO 2027",
  fecha: "2027-02-06",          // AAAA-MM-DD
  horaCuenta: "12:00",          // [PENDIENTE] hora de inicio para la cuenta regresiva (HH:MM)
  zonaHoraria: "-06:00",        // America/Mexico_City (sin horario de verano desde 2022)
  limiteConfirmar: "15 de enero de 2027",
  lugar: "[PENDIENTE] Nombre del lugar",
  direccion: "[PENDIENTE] Dirección",
  horaCeremonia: "[PENDIENTE]",
  horaRecepcion: "[PENDIENTE]",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mexico",  // [PENDIENTE] enlace de Google Maps
  whatsapp: "5210000000000"     // [PENDIENTE] con lada del país, sin + ni espacios
};

// [VERIFICAR contra el cuaderno]
const FRASE = "Padre Celestial, tu gracia nos unió hace 50 años y tu fidelidad nos ha dado alegrías, nos ha acompañado en la tristeza y en los momentos difíciles, y ha mantenido encendida la luz y la llama de nuestro amor. Somos la pareja de oro. Gracias a ti, Dios Padre.";

// [VERIFICAR] Cada grupo es un array: agrega o quita nombres libremente.
const PADRINOS = [
  { titulo: "Padrinos de Arras",   nombres: ["Arteh Gama Fuentes"] },
  { titulo: "Padrinos de Lazo",    nombres: ["Javier Gama Fuentes", "Esaú Gama Fuentes", "Brenda [apellido]"] },
  { titulo: "Padrinos de Anillos", nombres: ["César Gama Martínez", "[segundo nombre]"] }
];

// Lista local de ejemplo (solo se usa si Firebase NO está configurado).
// Prueba con: index.html?boleto=DEMO1
const BOLETOS_LOCALES = {
  DEMO1: { name: "Familia Pérez", passes: 4 },
  DEMO2: { name: "Sra. María López", passes: 2 }
};

/* ---------- UTILIDADES ---------- */

const $ = (s) => document.querySelector(s);
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const firebaseActivo = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Imágenes que faltan: la foto muestra un placeholder; la decoración se sustituye
// por un botánico dibujado en SVG (eucalipto / hortensia) hasta que subas tus PNG.
function svgUri(svg) { return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); }

function svgEucalipto(variante) {
  const hojas = variante === 2
    ? [[100,330,34,-40],[100,290,32,35],[100,245,30,-35],[100,200,28,32],[100,158,25,-30],[100,118,22,28],[100,82,18,-24],[100,52,14,20]]
    : [[100,340,36,-38],[100,298,34,38],[100,252,31,-34],[100,208,29,34],[100,166,26,-30],[100,128,22,30],[100,92,18,-26],[100,60,14,24]];
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 400'><defs>
    <radialGradient id='g' cx='35%' cy='30%' r='80%'><stop offset='0' stop-color='#cdb899'/><stop offset='.6' stop-color='#9c7f5b'/><stop offset='1' stop-color='#6f553a'/></radialGradient>
    <filter id='b'><feGaussianBlur stdDeviation='.7'/></filter></defs>
    <path d='M100 396C94 300 108 190 100 40' fill='none' stroke='#6b4f33' stroke-width='3' stroke-linecap='round'/>`;
  hojas.forEach(([x, y, r, rot], i) => {
    const dir = rot < 0 ? -1 : 1;
    s += `<g transform='translate(${x} ${y}) rotate(${rot})' filter='url(#b)'>
      <path d='M0 0Q${dir*4} -2 ${dir*r*.9} -4' stroke='#6b4f33' stroke-width='1.6' fill='none'/>
      <path d='M${dir*4} 0C${dir*r*.5} ${-r*.75} ${dir*r*1.5} ${-r*.8} ${dir*r*2} -3C${dir*r*1.5} ${r*.6} ${dir*r*.5} ${r*.55} ${dir*4} 0Z' fill='url(#g)' opacity='${i%2 ? .78 : .9}'/>
      <path d='M${dir*6} -2H${dir*(r*1.8)}' stroke='#f3e8d6' stroke-width='.8' opacity='.5'/></g>`;
  });
  for (let i = 0; i < 9; i++) { // hojitas pequeñas claras (acuarela suave)
    const y = 380 - i * 38, d = i % 2 ? 1 : -1;
    s += `<ellipse cx='${100 + d * (22 + (i % 3) * 6)}' cy='${y}' rx='7' ry='4.5' fill='#c9b58f' opacity='.55' transform='rotate(${d * 28} ${100 + d * 22} ${y})'/>`;
  }
  return svgUri(s + `</svg>`);
}

function svgHortensia() {
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs>
    <radialGradient id='p' cx='50%' cy='50%' r='60%'><stop offset='0' stop-color='#f4e3d8'/><stop offset='.7' stop-color='#e9d3c0'/><stop offset='1' stop-color='#d9c0a4'/></radialGradient></defs>
    <g fill='#b7b58a' opacity='.8'><ellipse cx='46' cy='150' rx='34' ry='14' transform='rotate(-30 46 150)'/><ellipse cx='150' cy='158' rx='32' ry='13' transform='rotate(25 150 158)'/></g>`;
  const pos = [[100,58],[62,78],[138,76],[44,114],[84,104],[120,108],[158,112],[68,142],[108,146],[140,144],[100,84],[96,124]];
  pos.forEach(([x, y], i) => {
    const r = 17 + (i % 3) * 2.5;
    s += `<g transform='translate(${x} ${y}) rotate(${i * 23})'>`;
    for (let k = 0; k < 4; k++) s += `<ellipse cx='0' cy='${-r * .55}' rx='${r * .55}' ry='${r * .62}' fill='url(#p)' stroke='#cfae96' stroke-width='.7' opacity='.93' transform='rotate(${k * 90})'/>`;
    s += `<circle r='2.4' fill='#b9b27c'/></g>`;
  });
  return svgUri(s + `</svg>`);
}

function marcarImagenFaltante(img) {
  if (img.classList.contains("deco") && !img.dataset.respaldo) {
    img.dataset.respaldo = "1";
    img.src = img.classList.contains("hortensia") ? svgHortensia()
      : svgEucalipto(img.src.includes("eucalipto-2") ? 2 : 1);
    return;
  }
  img.classList.add("img-falta");
}
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => marcarImagenFaltante(img));
  if (img.complete && img.naturalWidth === 0) marcarImagenFaltante(img);
});

/* ---------- CONTENIDO ---------- */

function pintarContenido() {
  $("#nombres").textContent = EVENTO.nombres;
  $("#fechaHero").textContent = EVENTO.fechaTexto;
  $("#frase").textContent = FRASE;
  $("#lugar").textContent = EVENTO.lugar;
  $("#direccion").textContent = EVENTO.direccion;
  $("#horaCeremonia").textContent = EVENTO.horaCeremonia;
  $("#horaRecepcion").textContent = EVENTO.horaRecepcion;
  $("#btnMapa").href = EVENTO.mapsUrl;
  $("#limiteRsvp").textContent = EVENTO.limiteConfirmar;

  const cont = $("#padrinos");
  PADRINOS.forEach((g) => {
    const div = document.createElement("div");
    div.className = "grupo";
    const h = document.createElement("h3");
    h.textContent = g.titulo;
    div.appendChild(h);
    g.nombres.forEach((n) => {
      const p = document.createElement("p");
      p.textContent = n;
      div.appendChild(p);
    });
    cont.appendChild(div);
  });
}

/* ---------- PORTADA (sobre) ---------- */

function iniciarPortada() {
  const sobre = $("#sobre"), portada = $("#portada");
  let abierto = false;
  $("#sello").addEventListener("click", () => {
    if (abierto) return;
    abierto = true;
    sobre.classList.add("abierto");
    const espera = reducirMovimiento ? 50 : 2300;
    setTimeout(() => {
      portada.classList.add("fuera");
      document.body.classList.remove("cover-lock");
      window.scrollTo(0, 0);
      portada.addEventListener("transitionend", () => portada.remove(), { once: true });
      setTimeout(() => portada.remove(), 1500);
    }, espera);
  });
}

/* ---------- APARICIÓN AL HACER SCROLL ---------- */

function iniciarReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visible")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((e) => obs.observe(e));
}

/* ---------- CUENTA REGRESIVA ---------- */

function iniciarCuenta() {
  const destino = new Date(`${EVENTO.fecha}T${EVENTO.horaCuenta}:00${EVENTO.zonaHoraria}`).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let resto = Math.max(0, destino - Date.now());
    const d = Math.floor(resto / 864e5); resto -= d * 864e5;
    const h = Math.floor(resto / 36e5);  resto -= h * 36e5;
    const m = Math.floor(resto / 6e4);   resto -= m * 6e4;
    const s = Math.floor(resto / 1e3);
    $("#cdD").textContent = pad(d); $("#cdH").textContent = pad(h);
    $("#cdM").textContent = pad(m); $("#cdS").textContent = pad(s);
    if (destino - Date.now() <= 0) { $("#cuenta").hidden = true; $("#cuentaFin").hidden = false; clearInterval(timer); }
  }
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- MÚSICA (opcional) ---------- */

function iniciarMusica() {
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "metadata";
  // Solo se muestra el reproductor si el archivo existe y es reproducible
  audio.addEventListener("loadedmetadata", () => { $("#musica").hidden = false; });
  audio.addEventListener("error", () => { $("#musica").hidden = true; });
  audio.src = "assets/musica.mp3";
  const btn = $("#musicaBtn");
  btn.addEventListener("click", () => {
    if (audio.paused) { audio.play().catch(() => {}); } else { audio.pause(); }
  });
  audio.addEventListener("play", () => { btn.setAttribute("aria-pressed", "true"); btn.setAttribute("aria-label", "Pausar música"); });
  audio.addEventListener("pause", () => { btn.setAttribute("aria-pressed", "false"); btn.setAttribute("aria-label", "Reproducir música"); });
}

/* ---------- BOLETOS Y CONFIRMACIÓN ---------- */

let boleto = null;   // { code, name, passes, answer, attendees, note }
let fb = null;       // { db, doc, getDoc, updateDoc, serverTimestamp }

const codigoUrl = (new URLSearchParams(location.search).get("boleto") || "").trim();
const codigoValido = /^[A-Za-z0-9_-]{3,40}$/.test(codigoUrl);

function mostrarEstado(msg, error) {
  const el = $("#estado");
  el.textContent = msg;
  el.classList.toggle("error", Boolean(error));
}

async function cargarFirebase() {
  const base = "https://www.gstatic.com/firebasejs/10.12.2/";
  const [app, fs] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")]);
  const db = fs.getFirestore(app.initializeApp(firebaseConfig));
  fb = { db, doc: fs.doc, getDoc: fs.getDoc, updateDoc: fs.updateDoc, serverTimestamp: fs.serverTimestamp };
}

async function buscarBoleto(code) {
  if (firebaseActivo) {
    const snap = await fb.getDoc(fb.doc(fb.db, "boletos", code));
    if (!snap.exists()) return null;
    const d = snap.data();
    return { code, name: d.name, passes: Number(d.passes) || 1, answer: d.answer || null, attendees: d.attendees, note: d.note || "" };
  }
  const clave = code.toUpperCase();
  const local = BOLETOS_LOCALES[clave];
  if (!local) return null;
  const guardado = JSON.parse(localStorage.getItem("boleto_" + clave) || "null");
  return { code: clave, name: local.name, passes: local.passes, answer: guardado?.answer || null, attendees: guardado?.attendees, note: guardado?.note || "" };
}

function textoRespuesta(b) {
  if (b.answer === "yes") {
    return `¡Gracias! Ya confirmaste tu asistencia para ${b.attendees} ${b.attendees === 1 ? "persona" : "personas"}.`;
  }
  return "Gracias por avisarnos. Registramos que no podrás asistir.";
}

function actualizarVistaBoleto() {
  const btn = $("#btnConfirmar");
  if (!boleto) { btn.disabled = true; return; }
  const inv = $("#invitado");
  inv.hidden = false;
  inv.textContent = `${boleto.name} · ${boleto.passes} ${boleto.passes === 1 ? "lugar reservado" : "lugares reservados"}`;
  if (boleto.answer) {
    mostrarEstado(textoRespuesta(boleto));
    btn.disabled = true;
  } else {
    mostrarEstado(`${boleto.name}: tienes ${boleto.passes} ${boleto.passes === 1 ? "lugar reservado" : "lugares reservados"}.`);
    btn.disabled = false;
  }
}

async function iniciarBoleto() {
  const btn = $("#btnConfirmar");
  btn.disabled = true;
  if (!codigoValido) {
    mostrarEstado(codigoUrl
      ? "El código de tu boleto no es válido. Revisa el enlace que recibiste."
      : "Abre esta invitación desde tu enlace personal para poder confirmar.", true);
    return;
  }
  try {
    if (firebaseActivo) await cargarFirebase();
    boleto = await buscarBoleto(codigoUrl);
  } catch (e) {
    console.error(e);
    mostrarEstado("No pudimos consultar tu boleto. Intenta de nuevo más tarde.", true);
    return;
  }
  if (!boleto) { mostrarEstado("No encontramos tu boleto. Revisa el enlace que recibiste.", true); return; }
  actualizarVistaBoleto();
}

function abrirModal() {
  if (!boleto || boleto.answer) return;
  const sel = $("#asistentes");
  sel.innerHTML = "";
  for (let i = 1; i <= boleto.passes; i++) {
    sel.add(new Option(`${i} ${i === 1 ? "persona" : "personas"}`, i));
  }
  sel.value = String(boleto.passes);
  $("#modalInvitado").textContent = `${boleto.name} · ${boleto.passes} ${boleto.passes === 1 ? "lugar" : "lugares"}`;
  $("#modalEstado").textContent = "";
  $("#modal").showModal();
}

async function enviarRespuesta(answer) {
  const nota = $("#nota").value.trim().slice(0, 300);
  const asistentes = answer === "yes" ? parseInt($("#asistentes").value, 10) : 0;
  if (answer === "yes" && !(asistentes >= 1 && asistentes <= boleto.passes)) {
    $("#modalEstado").textContent = "Elige un número de asistentes válido.";
    $("#modalEstado").classList.add("error");
    return;
  }
  const botones = [$("#btnSi"), $("#btnNo")];
  botones.forEach((b) => (b.disabled = true));
  try {
    if (firebaseActivo) {
      await fb.updateDoc(fb.doc(fb.db, "boletos", boleto.code), {
        answer, attendees: asistentes, note: nota, answeredAt: fb.serverTimestamp()
      });
    } else {
      localStorage.setItem("boleto_" + boleto.code, JSON.stringify({ answer, attendees: asistentes, note: nota }));
      abrirWhatsApp(answer, asistentes, nota);
    }
    Object.assign(boleto, { answer, attendees: asistentes, note: nota });
    $("#modal").close();
    actualizarVistaBoleto();
  } catch (e) {
    console.error(e);
    $("#modalEstado").classList.add("error");
    $("#modalEstado").textContent = "No se pudo guardar (quizá ya respondiste). Intenta de nuevo.";
  } finally {
    botones.forEach((b) => (b.disabled = false));
  }
}

function abrirWhatsApp(answer, asistentes, nota) {
  const estado = answer === "yes"
    ? `confirmo mi asistencia para ${asistentes} ${asistentes === 1 ? "persona" : "personas"}`
    : "lamento no poder asistir";
  const msg = `Hola, soy ${boleto.name} (boleto ${boleto.code}): ${estado} a las Bodas de Oro de ${EVENTO.nombres}.` + (nota ? ` Mensaje: ${nota}` : "");
  window.open(`https://wa.me/${EVENTO.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

function iniciarFormulario() {
  $("#btnConfirmar").addEventListener("click", abrirModal);
  $("#cerrar").addEventListener("click", () => $("#modal").close());
  $("#btnSi").addEventListener("click", () => enviarRespuesta("yes"));
  $("#btnNo").addEventListener("click", () => enviarRespuesta("no"));
  $("#form").addEventListener("submit", (e) => e.preventDefault());
}

/* ---------- ARRANQUE ---------- */

pintarContenido();
iniciarPortada();
iniciarReveal();
iniciarCuenta();
iniciarMusica();
iniciarFormulario();
iniciarBoleto();
