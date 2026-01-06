// src/services/emailService.ts
import emailjs from "@emailjs/browser";
import type { Request } from "../types/requests";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Validierung beim Laden
if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
  console.error("EmailJS Umgebungsvariablen fehlen!");
}

/**
 * Generiert den HTML-Content für die Email basierend auf dem Request-Typ
 */
function generateEmailHTML(data: Request): string {
  const timestamp = new Date().toLocaleString("de-DE", {
    dateStyle: "full",
    timeStyle: "short",
  });

  let detailsHTML = "";

  switch (data.type) {
    case "date":
      detailsHTML = `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #495057; margin: 0 0 15px 0;">📍 Date Anfrage</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6c757d; width: 120px;"><strong>Ort:</strong></td>
              <td style="padding: 8px 0; color: #212529;">${data.location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d;"><strong>Datum:</strong></td>
              <td style="padding: 8px 0; color: #212529;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d;"><strong>Uhrzeit:</strong></td>
              <td style="padding: 8px 0; color: #212529;">${data.time}</td>
            </tr>
          </table>
        </div>
      `;
      break;

    case "call":
      detailsHTML = `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #495057; margin: 0 0 15px 0;">📞 Anruf Buchung</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6c757d;"><strong>Datum:</strong></td>
              <td style="padding: 8px 0; color: #212529;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c757d;"><strong>Uhrzeit:</strong></td>
              <td style="padding: 8px 0; color: #212529;">${data.time}</td>
            </tr>
          </table>
        </div>
      `;
      break;

    case "nudes":
      detailsHTML = `
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h2 style="color: #856404; margin: 0 0 15px 0;">🔥 Nudes Request</h2>
          <div style="color: #856404; line-height: 1.6;">
            <strong>Gewünschter Inhalt:</strong><br/>
            <div style="margin-top: 10px; padding: 15px; background-color: white; border-radius: 4px;">
              ${data.content}
            </div>
          </div>
        </div>
      `;
      break;
  }

  const commentHTML = data.comment
    ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #e7f3ff; border-radius: 8px; border-left: 4px solid #0d6efd;">
        <strong style="color: #084298;">💬 Kommentar:</strong>
        <div style="margin-top: 8px; color: #084298;">
          ${data.comment}
        </div>
      </div>
    `
    : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✨ Neue Anfrage</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #495057; font-size: 16px; margin: 0 0 20px 0;">
          Hey! Du hast eine neue Anfrage über deine Website erhalten.
        </p>
        
        ${detailsHTML}
        ${commentHTML}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #dee2e6; color: #6c757d; font-size: 13px;">
          <strong>📅 Eingegangen am:</strong> ${timestamp}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p style="margin: 0;">Diese Email wurde automatisch generiert.</p>
      </div>
    </div>
  `;
}

/**
 * Sendet eine Request-Email über EmailJS
 */
export async function sendRequestEmail(data: Request): Promise<void> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("EmailJS Umgebungsvariablen nicht konfiguriert");
  }

  try {
    const emailHTML = generateEmailHTML(data);

    // Einfache Template-Parameter
    const templateParams = {
      email_content: emailHTML,
      subject: `Neue ${
        data.type === "date"
          ? "Date-Anfrage"
          : data.type === "call"
          ? "Anruf-Buchung"
          : "Nudes-Request"
      }`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("Email erfolgreich gesendet:", response);
  } catch (error) {
    console.error("Fehler beim Email-Versand:", error);
    throw new Error("Email konnte nicht gesendet werden");
  }
}
