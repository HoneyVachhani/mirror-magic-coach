/**
 * Google Apps Script Webhook for Mirror Magic Coach™
 * Connects the web app to save conversation data and track referrals into Google Sheets.
 */

var SHEET_ID = "14m7Y6KQ655f2fgcFWIK6Axg_kymbFq1WmlqsGjrlWLo";

function doGet(e) {
  try {
    var email = e.parameter.email;
    var action = e.parameter.action;
    
    if (action === "getReferrals" && email) {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      var data = sheet.getDataRange().getValues();
      
      var totalSuccessfulReferrals = 0;
      var emailsCounted = {}; // Prevent counting duplicates of same referred user
      
      // Assume column L (index 11) is User Email, column M (index 12) is Referrer Email
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row.length < 13) continue;
        
        var userEmail = (row[11] || "").toString().trim().toLowerCase();
        var referrerEmail = (row[12] || "").toString().trim().toLowerCase();
        
        if (userEmail && referrerEmail === email.trim().toLowerCase()) {
          if (!emailsCounted[userEmail]) {
            emailsCounted[userEmail] = true;
            totalSuccessfulReferrals++;
          }
        }
      }
      
      var premiumDaysCredited = Math.floor(totalSuccessfulReferrals / 5) * 7;
      
      var response = {
        status: "success",
        total_successful_referrals: totalSuccessfulReferrals,
        premium_days_credited: premiumDaysCredited
      };
      
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid action or parameters" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Add header row if empty
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
        "Outcome",
        "User Email",
        "Referrer Email"
      ]);
      sheet.getRange("A1:M1").setFontWeight("bold");
    } else {
      // Ensure headers exist in columns L and M for existing sheet
      var headerL = sheet.getRange("L1").getValue();
      if (!headerL) {
        sheet.getRange("L1").setValue("User Email").setFontWeight("bold");
        sheet.getRange("M1").setValue("Referrer Email").setFontWeight("bold");
      }
    }
    
    // Append the row matching the 13 columns in the sheet
    sheet.appendRow([
      data.date || "",
      data.time || "",
      data.name || "",
      data.membershipLevel || "",
      data.howFoundUs || "", 
      data.howFoundUs || "", 
      data.transcript || "", 
      data.keyEmotions || "", 
      data.keyTopics || "", 
      data.programsRecommended || "", 
      data.outcome || "",
      (data.email || "").toString().trim().toLowerCase(),
      (data.referrerEmail || "").toString().trim().toLowerCase()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
