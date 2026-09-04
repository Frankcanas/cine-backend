// app/src/utils/qr.ts - Generación QR para membresía HU-008 RN-033
import QRCode from "qrcode";

export async function generateMembershipQr(membershipCode: string): Promise<string> {
  if (!membershipCode) return "";
  try {
    // DataURL base64 PNG
    return await QRCode.toDataURL(membershipCode, {
      errorCorrectionLevel: "M",
      type: "image/png",
      margin: 2,
      width: 280,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
  } catch (e) {
    console.error("QR generation failed", e);
    return "";
  }
}

export async function generateQrForTicket(qrCode: string): Promise<string> {
  return generateMembershipQr(qrCode);
}
