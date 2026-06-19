/**
 * Google Apps Script Webhook for Mirror Magic Coach™
 * Connects the web app to save conversation data, track referrals, manage 7-day trials, and handle TagMango payment webhooks.
 */

var SHEET_ID = "14m7Y6KQ655f2fgcFWIK6Axg_kymbFq1WmlqsGjrlWLo";

function doGet(e) {
  try {
    var email = e.parameter.email;
    var action = e.parameter.action;
    
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email parameter required" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    email = email.trim().toLowerCase();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Ensure "Users" database sheet exists
    var usersSheet = ss.getSheetByName("Users");
    if (!usersSheet) {
      usersSheet = ss.insertSheet("Users");
      usersSheet.appendRow(["Email", "Trial Start Date", "Access Status", "Last Payment Date"]);
      usersSheet.getRange("A1:D1").setFontWeight("bold");
    }
    
    // Action 1: Check access status (Trial/Expired/Purchased)
    if (action === "checkAccess") {
      var data = usersSheet.getDataRange().getValues();
      var userRowIndex = -1;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0].toString().trim().toLowerCase() === email) {
          userRowIndex = i + 1;
          break;
        }
      }
      
      var today = new Date();
      
      // If user is new, register a 7-day trial immediately
      if (userRowIndex === -1) {
        usersSheet.appendRow([email, today, "Trial", ""]);
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: true,
          daysLeft: 7
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      var userRow = data[userRowIndex - 1];
      var trialStartDate = new Date(userRow[1]);
      var accessStatus = userRow[2].toString().trim();
      
      if (accessStatus === "Purchased") {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: false,
          daysLeft: 9999
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Calculate trial days passed
      var timeDiff = Math.abs(today.getTime() - trialStartDate.getTime());
      var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (accessStatus === "Trial" && daysPassed < 7) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: true,
          daysLeft: 7 - daysPassed
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Mark as Expired in sheet
        usersSheet.getRange(userRowIndex, 3).setValue("Expired");
        return ContentService.createTextOutput(JSON.stringify({
          status: "locked",
          isTrial: true,
          daysLeft: 0
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Action 2: Retrieve referrals (compounding referral system)
    if (action === "getReferrals") {
      var sheet = ss.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      
      var totalSuccessfulReferrals = 0;
      var emailsCounted = {};
      
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row.length < 13) continue;
        
        var userEmail = (row[11] || "").toString().trim().toLowerCase();
        var referrerEmail = (row[12] || "").toString().trim().toLowerCase();
        
        if (userEmail && referrerEmail === email) {
          if (!emailsCounted[userEmail]) {
            emailsCounted[userEmail] = true;
            totalSuccessfulReferrals++;
          }
        }
      }
      
      var premiumDaysCredited = Math.floor(totalSuccessfulReferrals / 5) * 7;
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        total_successful_referrals: totalSuccessfulReferrals,
        premium_days_credited: premiumDaysCredited
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var rawContent = e.postData.contents;
    var data = JSON.parse(rawContent);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Check if the POST is a TagMango payment webhook confirmation
    if (data.event && data.event === "payment.successful" && data.data && data.data.email) {
      var customerEmail = data.data.email.trim().toLowerCase();
      var usersSheet = ss.getSheetByName("Users");
      if (!usersSheet) {
        usersSheet = ss.insertSheet("Users");
        usersSheet.appendRow(["Email", "Trial Start Date", "Access Status", "Last Payment Date"]);
        usersSheet.getRange("A1:D1").setFontWeight("bold");
      }
      
      var usersData = usersSheet.getDataRange().getValues();
      var userRowIndex = -1;
      
      for (var i = 1; i < usersData.length; i++) {
        if (usersData[i][0].toString().trim().toLowerCase() === customerEmail) {
          userRowIndex = i + 1;
          break;
        }
      }
      
      var today = new Date();
      if (userRowIndex > -1) {
        // Upgrade existing trial/expired user to Purchased
        usersSheet.getRange(userRowIndex, 3).setValue("Purchased");
        usersSheet.getRange(userRowIndex, 4).setValue(today);
      } else {
        // Add new purchaser directly
        usersSheet.appendRow([customerEmail, today, "Purchased", today]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "TagMango access updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Standard Conversation Log Append
    var sheet = ss.getActiveSheet();
    
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
      var headerL = sheet.getRange("L1").getValue();
      if (!headerL) {
        sheet.getRange("L1").setValue("User Email").setFontWeight("bold");
        sheet.getRange("M1").setValue("Referrer Email").setFontWeight("bold");
      }
    }
    
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
