var SPREADSHEET_ID = "1wnu9S1kyA_hCWUTLXKEMOSLjUc4A-2JqFEkMeLNSxlA";
var SHEET_NAME = "LISTA DE PRESENÇA JÚRI SIMULADO";
var DESTINATION_EMAIL = "vivian.milani@unimep.br";

function doGet() {
  return jsonResponse({
    ok: true,
    message: "Apps Script ativo. Use o formulario para enviar uma inscricao."
  });
}

function doPost(e) {
  try {
    var data = e.parameter;
    var sheet = getOrCreateSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Nome completo",
        "Semestre",
        "Data/Hora"
      ]);
    }

    sheet.appendRow([
      data.name || "",
      data.semestre || "",
      new Date()
    ]);

    MailApp.sendEmail({
      to: DESTINATION_EMAIL,
      subject: "LISTA DE PRESENÇA JÚRI SIMULADO",
      body: buildEmailBody(data)
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  }
}

function getOrCreateSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function buildEmailBody(data) {
  return [
    "Nova inscrição recebida:",
    "",
    "Nome: " + (data.name || ""),
    "Semestre: " + (data.semestre || "")
  ].join("\n");
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
