/**
 * Google Apps Script Webhook for Mirror Magic Coach™
 * Connects the web app to save conversation data into Google Sheets.
 * 
 * Setup instructions:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/14m7Y6KQ655f2fgcFWIK6Axg_kymbFq1WmlqsGjrlWLo/edit
 * 2. In Google Sheets, click Extensions > Apps Script
 * 3. Delete any code in Code.gs and paste this file's code.
 * 4. Click Save (floppy disk icon)
 * 5. Click Deploy > New deployment
 * 6. Under "Select type", choose "Web app"
 * 7. Set:
 *    - Description: "Mirror Magic Logging Webhook"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"
 * 8. Click Deploy
 * 9. Authorize access when prompted
 * 10. Copy the "Web app URL" (ends with /exec)
 * 11. Open app.js and paste the Web app URL into the GOOGLE_SCRIPT_WEBAPP_URL constant at the top
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    // Use openById because this is a standalone script (not bound to the sheet)
    var sheet = SpreadsheetApp.openById("14m7Y6KQ655f2fgcFWIK6Axg_kymbFq1WmlqsGjrlWLo").getActiveSheet();
    
    // Add header row if empty to match the sheet layout exactly
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date", 
        "Time", 
        "Name", 
        "Membership Level", 
        "How They Found Us",
        "Traffic Source",
        "Conversation Transcript", 
        "Key Emotions Mentioned", 
        "Key Topics Mentioned", 
        "Programs Recommended", 
        "Outcome"
      ]);
      // Format headers bold
      sheet.getRange("A1:K1").setFontWeight("bold");
    }
    
    // Append the row matching the 11 columns in the sheet
    sheet.appendRow([
      data.date || "",
      data.time || "",
      data.name || "",
      data.membershipLevel || "",
      data.howFoundUs || "", // Column E: How They Found Us
      data.howFoundUs || "", // Column F: Traffic Source
      data.transcript || "", // Column G: Conversation Transcript
      data.keyEmotions || "", // Column H: Key Emotions Mentioned
      data.keyTopics || "", // Column I: Key Topics Mentioned
      data.programsRecommended || "", // Column J: Programs Recommended
      data.outcome || "" // Column K: Outcome
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
