/**
 * Google Apps Script for Aleena R. Portfolio Contact Form
 * 
 * Intended Notification Recipient: aleenaraju203@gmail.com
 * Time Zone: Asia/Kolkata
 * 
 * Recorded Fields in Google Sheet:
 * 1. Submission Date
 * 2. Submission Time (Asia/Kolkata)
 * 3. Name
 * 4. Email
 * 5. Subject (Optional)
 * 6. Message
 * 7. Phone (Optional / Compatibility)
 */

function doPost(e) {
  try {
    // 1. Extract payload from either URL-encoded/URLSearchParams (e.parameter) or JSON body
    var data = {};
    if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.message)) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = (e && e.parameter) ? e.parameter : {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var name = (data.name || "").toString().trim();
    var email = (data.email || "").toString().trim();
    var subject = (data.subject || "").toString().trim();
    var message = (data.message || "").toString().trim();
    var phone = (data.phone || "").toString().trim();

    // 2. Validate required inputs
    if (!name || !email || !message) {
      return createJsonResponse({
        success: false,
        message: "Please provide your name, email and message."
      });
    }

    // 3. Timezone formatting in Asia/Kolkata
    var now = new Date();
    var timeZone = "Asia/Kolkata";
    var dateFormatted = Utilities.formatDate(now, timeZone, "yyyy-MM-dd");
    var timeFormatted = Utilities.formatDate(now, timeZone, "hh:mm:ss a");

    // 4. Save into active Google Sheet
    var ss = SpreadsheetApp.openById('1eg6eQsI4m2DL6Ne3vaxbdVStX0VmHnH25QdLuKLsQOM');
var sheet = ss.getSheetByName('Messages');

if (!sheet) {
  sheet = ss.insertSheet('Messages');
}
    
    // Auto-create header row if sheet is completely new/empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date", "Time (IST)", "Name", "Email", "Subject", "Message", "Phone"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }

    // Append record
    sheet.appendRow([
      dateFormatted,
      timeFormatted,
      name,
      email,
      subject || "—",
      message,
      phone || "—"
    ]);

    // 5. Send Email notification to aleenaraju203@gmail.com
    var recipient = "aleenaraju203@gmail.com";
    var emailSubject = subject 
      ? "New Portfolio Message: " + subject + " (from " + name + ")" 
      : "New Portfolio Message from " + name;

    var htmlBody = 
      "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid rgba(164, 110, 255, 0.3); border-radius: 16px; background-color: #FAF5FF;'>" +
        "<h2 style='color: #7E22CE; margin-top: 0; font-size: 20px; font-weight: 700;'>New Contact Form Submission</h2>" +
        "<p style='color: #6B7280; font-size: 14px; margin-bottom: 20px;'>You received a new inquiry through your portfolio website contact form.</p>" +
        "<table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;'>" +
          "<tr><td style='padding: 8px 0; font-weight: 600; color: #4B5563; width: 130px;'>Date & Time:</td><td style='color: #1F2937;'>" + dateFormatted + " at " + timeFormatted + " (Asia/Kolkata IST)</td></tr>" +
          "<tr><td style='padding: 8px 0; font-weight: 600; color: #4B5563;'>Name:</td><td style='color: #1F2937; font-weight: 600;'>" + escapeHtml(name) + "</td></tr>" +
          "<tr><td style='padding: 8px 0; font-weight: 600; color: #4B5563;'>Email:</td><td style='color: #1F2937;'><a href='mailto:" + escapeHtml(email) + "' style='color: #9333EA; text-decoration: underline;'>" + escapeHtml(email) + "</a></td></tr>" +
          (subject ? "<tr><td style='padding: 8px 0; font-weight: 600; color: #4B5563;'>Subject:</td><td style='color: #1F2937;'>" + escapeHtml(subject) + "</td></tr>" : "") +
          (phone ? "<tr><td style='padding: 8px 0; font-weight: 600; color: #4B5563;'>Phone:</td><td style='color: #1F2937;'>" + escapeHtml(phone) + "</td></tr>" : "") +
        "</table>" +
        "<div style='margin-top: 16px; padding: 16px; background-color: #FFFFFF; border: 1px solid rgba(164, 110, 255, 0.2); border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);'>" +
          "<p style='font-weight: 700; color: #6B21A8; margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;'>Message Content:</p>" +
          "<p style='color: #1F2937; margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px;'>" + escapeHtml(message) + "</p>" +
        "</div>" +
        "<p style='font-size: 12px; color: #9CA3AF; margin-top: 24px; text-align: center;'>Aleena R Portfolio &bull; Timezone: Asia/Kolkata (IST)</p>" +
      "</div>";

    try {
      MailApp.sendEmail({
        to: recipient,
        subject: emailSubject,
        htmlBody: htmlBody,
        replyTo: email
      });
    } catch (mailErr) {
      Logger.log("MailApp notice: " + mailErr.toString());
    }

    return createJsonResponse({
      success: true,
      message: "Your message has been sent successfully."
    });

  } catch (err) {
    Logger.log("doPost Error: " + err.toString());
    return createJsonResponse({
      success: false,
      message: "Server error processing submission: " + err.toString()
    });
  }
}

function doGet(e) {
  return createJsonResponse({
    success: true,
    message: "Aleena R. Portfolio Contact Webhook is running."
  });
}

function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
