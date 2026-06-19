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
      usersSheet.appendRow(["Email", "Trial Start Date", "Access Status", "Last Payment Date", "Name", "Phone", "Referrer", "First Reflection Completed", "Referral Days Added"]);
      usersSheet.getRange("A1:I1").setFontWeight("bold");
    }
    
    // Action 1: Check access status or register user
    if (action === "checkAccess") {
      var name = e.parameter.name || "";
      var phone = e.parameter.phone || "";
      var referrer = e.parameter.referrer || "";
      
      var data = usersSheet.getDataRange().getValues();
      var userRowIndex = -1;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0].toString().trim().toLowerCase() === email) {
          userRowIndex = i + 1;
          break;
        }
      }
      
      var today = new Date();
      
      // If user is new:
      if (userRowIndex === -1) {
        // If Name and Phone are not provided, we return "register_required" status
        if (!name || !phone) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "register_required",
            message: "User must register first"
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Register new user with 7-day trial
        usersSheet.appendRow([email, today, "Trial", "", name, phone, referrer, "FALSE", 0]);
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: true,
          daysLeft: 7,
          tier: "Trial"
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      var userRow = data[userRowIndex - 1];
      var trialStartDate = new Date(userRow[1]);
      var accessStatus = userRow[2].toString().trim();
      var referralDaysAdded = parseInt(userRow[8] || 0, 10);
      
      if (accessStatus === "Purchased" || accessStatus === "silver" || accessStatus === "gold" || accessStatus === "diamond" || accessStatus === "platinum") {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: false,
          daysLeft: 9999,
          tier: accessStatus
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Calculate trial days passed
      var timeDiff = Math.abs(today.getTime() - trialStartDate.getTime());
      var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      // Total trial days = 7 + referralDaysAdded
      var totalTrialDays = 7 + referralDaysAdded;
      
      if (accessStatus === "Trial" && daysPassed < totalTrialDays) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: true,
          daysLeft: totalTrialDays - daysPassed,
          tier: accessStatus
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Mark as Expired in sheet
        usersSheet.getRange(userRowIndex, 3).setValue("Expired");
        return ContentService.createTextOutput(JSON.stringify({
          status: "locked",
          isTrial: true,
          daysLeft: 0,
          tier: "Expired"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Action 2: Retrieve referrals (compounding referral system)
    if (action === "getReferrals") {
      var data = usersSheet.getDataRange().getValues();
      var totalSuccessfulReferrals = 0;
      
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var refEmail = (row[6] || "").toString().trim().toLowerCase();
        var refCompleted = row[7];
        
        if (refEmail === email && refCompleted === "TRUE") {
          totalSuccessfulReferrals++;
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
    if (data.event && (data.event === "payment.successful" || data.event === "order.created.completed")) {
      var customerEmail = "";
      if (data.data) {
        if (typeof data.data === "string") {
          try {
            var nestedData = JSON.parse(data.data);
            if (nestedData.email) customerEmail = nestedData.email;
            else if (nestedData.user && nestedData.user.email) customerEmail = nestedData.user.email;
          } catch(e) {}
        } else {
          if (data.data.email) {
            customerEmail = data.data.email;
          } else if (data.data.user && data.data.user.email) {
            customerEmail = data.data.user.email;
          } else if (data.data.customer && data.data.customer.email) {
            customerEmail = data.data.customer.email;
          } else if (data.data.order && data.data.order.email) {
            customerEmail = data.data.order.email;
          }
        }
      }
      if (!customerEmail && data.email) {
        customerEmail = data.email;
      }
      
      if (!customerEmail) {
        // Fallback: log the payload if we cannot find email
        var logSheet = ss.getSheetByName("WebhookLogs");
        if (!logSheet) {
          logSheet = ss.insertSheet("WebhookLogs");
          logSheet.appendRow(["Date", "Payload"]);
        }
        logSheet.appendRow([new Date(), rawContent]);
        
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email not found in payload" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      customerEmail = customerEmail.trim().toLowerCase();
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
    
    // Update referred status when first reflection completed
    var usersSheet = ss.getSheetByName("Users");
    var userEmail = (data.email || "").toString().trim().toLowerCase();
    if (usersSheet && userEmail) {
      var usersData = usersSheet.getDataRange().getValues();
      var userRowIndex = -1;
      for (var i = 1; i < usersData.length; i++) {
        if (usersData[i][0].toString().trim().toLowerCase() === userEmail) {
          userRowIndex = i + 1;
          break;
        }
      }
      if (userRowIndex > -1) {
        var firstReflectionCompleted = usersData[userRowIndex - 1][7];
        if (firstReflectionCompleted !== "TRUE" && firstReflectionCompleted !== true) {
          // Set to TRUE
          usersSheet.getRange(userRowIndex, 8).setValue("TRUE");
          
          // Check if they were referred by someone
          var referrerEmail = (usersData[userRowIndex - 1][6] || "").toString().trim().toLowerCase();
          if (referrerEmail && referrerEmail !== userEmail) {
            // Count verified referrals for referrer
            var referrerRowIndex = -1;
            for (var j = 1; j < usersData.length; j++) {
              if (usersData[j][0].toString().trim().toLowerCase() === referrerEmail) {
                referrerRowIndex = j + 1;
                break;
              }
            }
            if (referrerRowIndex > -1) {
              var verifiedCount = 0;
              for (var k = 1; k < usersData.length; k++) {
                var refEmail = (usersData[k][6] || "").toString().trim().toLowerCase();
                var refCompleted = usersData[k][7];
                if (refEmail === referrerEmail && refCompleted === "TRUE") {
                  verifiedCount++;
                }
              }
              // Calculate bonus days: 7 days for every 5 successful referrals
              var bonusDays = Math.floor(verifiedCount / 5) * 7;
              usersSheet.getRange(referrerRowIndex, 9).setValue(bonusDays);
            }
          }
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
