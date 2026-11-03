const RSVP_SHEET_NAME = "Confirmaciones";
const RSVP_SPREADSHEET_PROPERTY = "RSVP_SPREADSHEET_ID";
const RSVP_HEADERS = ["Fecha y hora", "Identificador de navegador (SHA-256)", "Nombre completo", "Asistencia", "Nombre normalizado"];

function setupRsvpSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Abre este proyecto de Apps Script desde la hoja de cálculo.");
  }

  const sheet = getOrCreateRsvpSheet(spreadsheet);
  PropertiesService.getScriptProperties().setProperty(RSVP_SPREADSHEET_PROPERTY, spreadsheet.getId());
  return sheet.getName();
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const deviceId = String(parameters.deviceId || "").trim();
  const fullName = String(parameters.fullName || "").replace(/\s+/g, " ").trim();
  const attendance = String(parameters.attendance || "").trim();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(deviceId)) {
    return responsePage("No se pudo preparar la confirmación", "Regresa a la invitación e inténtalo de nuevo desde el mismo navegador.");
  }
  if (fullName.length < 3 || fullName.length > 120) {
    return responsePage("Revisa el nombre completo", "Ingresa un nombre de entre 3 y 120 caracteres.");
  }
  if (attendance !== "Sí" && attendance !== "No") {
    return responsePage("Selecciona una respuesta", "Regresa a la invitación y elige si podrás asistir.");
  }

  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(RSVP_SPREADSHEET_PROPERTY);
  if (!spreadsheetId) {
    return responsePage("Confirmación no disponible", "El organizador todavía debe configurar la hoja de cálculo.");
  }

  const deviceHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    deviceId,
    Utilities.Charset.UTF_8
  ).map(byte => (byte + 256).toString(16).slice(-2)).join("");
  const normalizedName = normalizeName(fullName);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = getOrCreateRsvpSheet(spreadsheet);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingEntries = sheet.getRange(2, 2, lastRow - 1, 4).getValues();
      if (existingEntries.some(row => row[0] === deviceHash)) {
        return responsePage("Este invitado ya respondió", "Solo se permite una respuesta por invitado. Si necesitas ayuda, comunícate con los organizadores.");
      }
      if (existingEntries.some(row => row[3] === normalizedName)) {
        return responsePage("Ya recibimos una respuesta con ese nombre", "Si necesitas corregirla, comunícate con los organizadores.");
      }
    }

    const safeName = /^[=+\-@]/.test(fullName) ? `'${fullName}` : fullName;
    sheet.appendRow([new Date(), deviceHash, safeName, attendance, normalizedName]);
  } finally {
    lock.releaseLock();
  }

  return responsePage("¡Gracias por confirmar!", "Tu respuesta se guardó correctamente.");
}

function normalizeName(name) {
  return name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getOrCreateRsvpSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
    sheet.setFrozenRows(1);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, RSVP_HEADERS.length).getDisplayValues()[0];
    if (RSVP_HEADERS.some((header, index) => currentHeaders[index] !== header)) {
      throw new Error(`La hoja "${RSVP_SHEET_NAME}" ya existe con encabezados diferentes. Revisa la primera fila antes de usarla.`);
    }
  }
  return sheet;
}

function responsePage(title, message) {
  return HtmlService.createHtmlOutput(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="margin:0;padding:32px;background:#faf6ee;color:#3a3226;font:18px Georgia,serif;text-align:center"><main style="max-width:440px;margin:10vh auto;padding:32px 24px;background:#fffdf8;border:1px solid #d8bf7a"><h1 style="color:#8a6d27">${title}</h1><p>${message}</p></main></body></html>`
  );
}
