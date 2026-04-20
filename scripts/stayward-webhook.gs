/**
 * Stayward — Plan webhook receiver
 * ==================================================================
 * This Google Apps Script receives POST requests from your Stayward
 * deployment whenever someone submits a brief, writes them to the
 * bound Google Sheet, and emails you a notification.
 *
 * Setup:
 *   1. Create a new Google Sheet. Rename the first sheet/tab to "Briefs".
 *   2. Extensions -> Apps Script. Delete the default code.
 *   3. Paste this entire file into Code.gs. Save.
 *   4. Update the NOTIFY_EMAIL constant below to your real email.
 *   5. Deploy -> New deployment -> Type: Web app.
 *      Description: "Stayward webhook"
 *      Execute as: Me
 *      Who has access: Anyone
 *      Click Deploy. Authorise when prompted.
 *   6. Copy the Web app URL.
 *   7. In Vercel -> Project -> Settings -> Environment Variables, add:
 *        Name:  PLAN_WEBHOOK_URL
 *        Value: (the Web app URL)
 *        Tick Production, Preview, Development. Save.
 *   8. Vercel -> Deployments -> latest -> Redeploy (untick Use cache).
 *   9. Submit a test brief from https://hotel-city-khaki.vercel.app/plan/ —
 *      you should see a new row in the Sheet within a few seconds, and
 *      get a notification email.
 *
 * If you update this script later, you MUST redeploy: Deploy -> Manage
 * deployments -> edit the existing deployment -> New version. Simply
 * saving the script file is not enough.
 */

// ==== CONFIG: update these before deploying =========================
var NOTIFY_EMAIL = 'you@yourdomain.com';   // where to send new-brief alerts
var NOTIFY_SUBJECT_PREFIX = '[Stayward] New brief';
var SHEET_NAME = 'Briefs';
// ===================================================================

// Columns written to the sheet, in order. First row is used as the
// header if the sheet is empty.
var COLUMNS = [
  'timestamp',
  'listingId',
  'source',
  'name',
  'email',
  'rawQuery',
  'city',
  'checkIn',
  'checkOut',
  'guests',
  'rooms',
  'maxPriceGbp',
  'userId'
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    var sheet = getOrCreateSheet();

    // Write header row if the sheet is blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Build the row in the same order as COLUMNS
    var row = COLUMNS.map(function (col) {
      return payload[col] !== undefined && payload[col] !== null ? String(payload[col]) : '';
    });

    sheet.appendRow(row);

    // Send notification email
    sendNotificationEmail(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('doPost error:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check: visiting the Web app URL in a browser returns "ok"
function doGet() {
  return ContentService
    .createTextOutput('Stayward webhook live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function sendNotificationEmail(payload) {
  if (!NOTIFY_EMAIL || NOTIFY_EMAIL === 'you@yourdomain.com') return;

  var subject = NOTIFY_SUBJECT_PREFIX;
  if (payload.city) subject += ', ' + payload.city;
  if (payload.source === 'dashboard') subject += ' (logged in)';

  var lines = [];
  lines.push('A new brief just came in on Stayward.');
  lines.push('');
  lines.push('--- The brief ---');
  lines.push(payload.rawQuery || '(none)');
  lines.push('');
  lines.push('--- Submitter ---');
  lines.push('Email: ' + (payload.email || '(none)'));
  if (payload.name) lines.push('Name: ' + payload.name);
  if (payload.source === 'dashboard') {
    lines.push('Signed in: yes');
    if (payload.listingId) lines.push('Listing ID: ' + payload.listingId);
  } else {
    lines.push('Signed in: no');
  }
  lines.push('');
  lines.push('--- Details ---');
  if (payload.city) lines.push('City: ' + payload.city);
  if (payload.checkIn && payload.checkOut) {
    lines.push('Dates: ' + payload.checkIn + ' to ' + payload.checkOut);
  }
  if (payload.guests) lines.push('Guests: ' + payload.guests);
  if (payload.rooms) lines.push('Rooms: ' + payload.rooms);
  if (payload.maxPriceGbp) lines.push('Max per night: \u00a3' + payload.maxPriceGbp);
  lines.push('');
  lines.push('--- ');
  lines.push('Reply to the traveller: ' + (payload.email || ''));
  lines.push('Full row in the Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    body: lines.join('\n')
  });
}
