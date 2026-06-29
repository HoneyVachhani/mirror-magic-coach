/**
 * Google Apps Script Webhook for Mirror Magic Coach™
 * Connects the web app to save conversation data, track referrals, manage 7-day trials, and handle TagMango payment webhooks.
 */

var SHEET_ID = "14m7Y6KQ655f2fgcFWIK6Axg_kymbFq1WmlqsGjrlWLo";

function doGet(e) {
  try {
    var action = e.parameter.action;
    
    // Health check endpoint
    if (action === "health") {
      var ss = SpreadsheetApp.openById(SHEET_ID);
      var usersSheet = ss.getSheetByName("Users");
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Spreadsheet connection is live",
        spreadsheetName: ss.getName(),
        usersSheetExists: !!usersSheet
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var email = e.parameter.email;
    
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email parameter required" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    email = email.trim().toLowerCase();
    
    // Action: Log Quiz Results
    if (action === "logQuiz") {
      var ss = SpreadsheetApp.openById(SHEET_ID);
      var quizSheet = ss.getSheetByName("QuizResults");
      if (!quizSheet) {
        quizSheet = ss.insertSheet("QuizResults");
        quizSheet.appendRow(["Timestamp", "Email", "Name", "Category", "Diagnosis Block", "Diagnosis Type", "Answers Details"]);
      }
      var name = e.parameter.name || "";
      var category = e.parameter.category || "";
      var blockTitle = e.parameter.blockTitle || "";
      var blockType = e.parameter.blockType || "";
      var answers = e.parameter.answers || "";
      
      quizSheet.appendRow([new Date(), email, name, category, blockTitle, blockType, answers]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Quiz result logged" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Action: Send OTP
    if (action === "sendOTP") {
      var code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit code
      var props = PropertiesService.getScriptProperties();
      var now = new Date().getTime();
      props.setProperty("OTP_" + email, JSON.stringify({ code: code, expires: now + 10 * 60 * 1000 })); // 10 minutes expiry
      
      try {
        MailApp.sendEmail({
          to: email,
          subject: "Your Mirror Magic Security Verification Code",
          htmlBody: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border: 1px solid #e2e2e2; border-radius: 12px; background-color: #fffbf2;">
              <h2 style="color: #b78c2d;">Mirror Magic Coach™</h2>
              <p>Hello,</p>
              <p>You requested a security verification code to access your Mirror Magic Coach account. Use this code to complete your login:</p>
              <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background: #ffffff; border: 2px solid #b78c2d; border-radius: 8px; color: #1c1c1e; letter-spacing: 2px; margin: 20px 0;">
                ${code}
              </div>
              <p style="font-size: 12px; color: #666666;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Failed to send email: " + err.toString() }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "OTP sent successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Action: Verify OTP
    if (action === "verifyOTP") {
      var enteredOtp = e.parameter.otp;
      if (!enteredOtp) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "OTP parameter is required" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var props = PropertiesService.getScriptProperties();
      var storedDataStr = props.getProperty("OTP_" + email);
      if (!storedDataStr) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No active verification request found or OTP expired" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var storedData = JSON.parse(storedDataStr);
      var now = new Date().getTime();
      
      if (now > storedData.expires) {
        props.deleteProperty("OTP_" + email);
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Verification code has expired. Please request a new one." }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      if (storedData.code !== enteredOtp.trim()) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Incorrect verification code. Please try again." }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Success: Delete the OTP so it cannot be reused
      props.deleteProperty("OTP_" + email);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", verified: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
      
      // Check if they claimed to be an existing member
      var isMember = e.parameter.isMember || "false";
      
      // If user is new:
      if (userRowIndex === -1) {
        if (isMember === "true") {
          return ContentService.createTextOutput(JSON.stringify({
            status: "not_found",
            message: "We couldn't find this email in our paid member list. Please check your email spelling or register as a new user."
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
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
      var accessStatus = userRow[2].toString().trim().toLowerCase();
      var referralDaysAdded = parseInt(userRow[8] || 0, 10);
      var name = userRow[4] || "";
      
      if (accessStatus === "purchased" || accessStatus === "silver" || accessStatus === "gold" || accessStatus === "diamond" || accessStatus === "platinum") {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: false,
          daysLeft: 9999,
          tier: accessStatus,
          name: name
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Calculate trial days passed
      var timeDiff = Math.abs(today.getTime() - trialStartDate.getTime());
      var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      // Total trial days = 7 + referralDaysAdded
      var totalTrialDays = 7 + referralDaysAdded;
      
      if (accessStatus === "trial" && daysPassed < totalTrialDays) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "active",
          isTrial: true,
          daysLeft: totalTrialDays - daysPassed,
          tier: accessStatus,
          name: name
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Mark as Expired in sheet
        usersSheet.getRange(userRowIndex, 3).setValue("Expired");
        return ContentService.createTextOutput(JSON.stringify({
          status: "locked",
          isTrial: true,
          daysLeft: 0,
          tier: "Expired",
          name: name
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
      
      var premiumDaysCredited = getBonusDaysForReferrals(totalSuccessfulReferrals);
      
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
    
    // Check if the POST is an email transcript action
    if (data.action === "emailTranscript") {
      var email = data.email || "";
      var transcript = data.transcript || "";
      if (email && transcript) {
        MailApp.sendEmail({
          to: email,
          subject: "Your Mirror Magic Coach™ Conversation History",
          body: "Hello,\n\nHere is a copy of your session conversation history with Honey's AI Coach:\n\n" + transcript + "\n\nWarm regards,\nHoney Vachhani & The Mirror Magic Team"
        });
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Email sent" }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Missing email or transcript" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
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
    
    // Standard Conversation Log Append or Update
    var sheet = ss.getSheetByName("ConversationLogs");
    if (!sheet) {
      sheet = ss.insertSheet("ConversationLogs");
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)", 
        "User Full Name", 
        "User Email Address", 
        "User WhatsApp Number", 
        "Membership Voice Selected", 
        "Total Exchanges", 
        "Trial Day Number", 
        "Did Offer Appear?", 
        "User Response to Offer", 
        "Full Conversation Transcript",
        "Session ID"
      ]);
      sheet.getRange("A1:K1").setFontWeight("bold");
    }
    
    var sessionId = data.sessionId || "";
    var foundRowIndex = -1;
    
    if (sessionId) {
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][10] && values[i][10].toString().trim() === sessionId.toString().trim()) {
          foundRowIndex = i + 1;
          break;
        }
      }
    }
    
    var rowData = [
      data.timestampIST || "",
      data.name || "",
      data.email || "",
      data.whatsapp || "",
      data.membershipVoice || "",
      data.totalExchanges || 0,
      data.trialDay || "",
      data.didOfferAppear || "",
      data.offerResponse || "",
      data.transcript || "",
      sessionId
    ];
    
    if (foundRowIndex > -1) {
      sheet.getRange(foundRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
    
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
              // Calculate bonus days based on new referral tiers
              var bonusDays = getBonusDaysForReferrals(verifiedCount);
              usersSheet.getRange(referrerRowIndex, 9).setValue(bonusDays);
            }
          }
        }
      }
    }
    
    
    // Check and trigger WhatsApp nudges (Aisensy integration)
    checkAndTriggerNudges(data, usersSheet);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Checks trial day parameters and triggers corresponding WhatsApp notifications using the Aisensy API.
 * 
 * Required Aisensy API details to configure:
 * - AISENSY_API_KEY: Campaign trigger API key / token.
 * - AISENSY_CAMPAIGN_DAY3: Name of the Day 3 template campaign.
 * - AISENSY_CAMPAIGN_DAY7: Name of the Day 7 template campaign.
 */
var AISENSY_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmNhOTk4ZGUxMGQ0YzZlMiM1bWw1OiJnaXJyb3JfbWg3Wll1bWlQcjhjYWxJciJjdi11IjoiaQw1TzW5zeSIsImNsaWVuWiJjIiJjNnZiYjgzZjQ0NH0.JKAjJYs7PMotnigdvk0QCPp0_Dp-J5V_rvg24FSPxL0"; // Replace with your actual Aisensy API Key
var AISENSY_API_URL = "https://backend.aisensy.com/campaign/t1/api/v2";

function checkAndTriggerNudges(data, usersSheet) {
  try {
    var userEmail = (data.email || "").toString().trim().toLowerCase();
    var whatsapp = (data.whatsapp || "").toString().trim();
    var trialDay = (data.trialDay || "").toString().trim();
    
    if (!whatsapp || !trialDay) return;
    
    // Remove spacing/special characters from phone, ensure country code is clean
    var cleanPhone = whatsapp.replace(/[^0-9+]/g, "");
    if (!cleanPhone.startsWith("+")) {
      // Default to India country code if not present (as fallback)
      cleanPhone = "+91" + cleanPhone.replace(/^0+/, "");
    }
    
    var campaignName = "";
    var templateParams = [];
    var destinationLink = "https://coach.mirrormagicmethod.com";
    
    if (trialDay === "Day 3") {
      campaignName = "mirror_day3_nudge"; // Name of template campaign in Aisensy
      templateParams = [data.name || "friend"];
    } else if (trialDay === "Day 7") {
      campaignName = "mirror_day7_offer"; // Name of template campaign in Aisensy
      templateParams = [data.name || "friend"];
    } else {
      return; // No nudge defined for other days
    }
    
    if (AISENSY_API_KEY === "YOUR_AISENSY_API_KEY") {
      Logger.log("Aisensy API key not configured. Trigger log for: " + campaignName + " to " + cleanPhone);
      return;
    }
    
    // Payload format as per Aisensy Campaign API docs:
    // POST to https://backend.aisensy.com/campaign/t1/api/v2
    var payload = {
      "apiKey": AISENSY_API_KEY,
      "campaignName": campaignName,
      "destination": cleanPhone,
      "userName": data.name || "User",
      "templateParams": templateParams,
      "source": "MirrorMagicCoach"
    };
    
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(AISENSY_API_URL, options);
    Logger.log("Aisensy Response for " + campaignName + ": " + response.getContentText());
  } catch(e) {
    Logger.log("Error triggering Aisensy WhatsApp nudge: " + e.toString());
  }
}

// Reward tiers:
// 1 referral -> +3 days
// 3 referrals -> +7 days
// 5 referrals -> 30 days (1 month free)
// 10 referrals -> 90 days (3 months free)
function getBonusDaysForReferrals(count) {
  if (count >= 10) return 90;
  if (count >= 5) return 30;
  if (count >= 3) return 7;
  if (count >= 1) return 3;
  return 0;
}
