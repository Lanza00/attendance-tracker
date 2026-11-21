import { readFile } from "node:fs/promises";
import { JWT } from "google-auth-library";

export const runtime = "nodejs";

const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";
const attendanceRange = encodeURIComponent("Attendance!A:B");

export async function POST(request: Request) {
  const data: { name?: unknown; address?: unknown } | null =
    await request.json().catch(() => null);
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const address = typeof data?.address === "string" ? data.address.trim() : "";

  if (!name || !address || name.length > 150 || address.length > 500) {
    return Response.json(
      { message: "Enter a name (up to 150 characters) and address (up to 500 characters)." },
      { status: 400 },
    );
  }

  const {
    GOOGLE_SHEETS_SPREADSHEET_ID: spreadsheetId,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: email,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: privateKey,
    GOOGLE_SERVICE_ACCOUNT_KEY_FILE: keyFile,
  } = process.env;

  if (!spreadsheetId || (!keyFile && (!email || !privateKey))) {
    return Response.json(
      { message: "Check-in is unavailable. Please contact the organizer." },
      { status: 503 },
    );
  }

  const spreadsheet = encodeURIComponent(spreadsheetId);
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet}/values/${attendanceRange}:append`;

  try {
    const credentials: { client_email?: string; private_key?: string } = keyFile
      ? JSON.parse(await readFile(keyFile, "utf8"))
      : { client_email: email, private_key: privateKey };
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key?.replace(/\\n/g, "\n"),
      scopes: [sheetsScope],
    });
    await auth.request({
      url: endpoint,
      method: "POST",
      params: { valueInputOption: "RAW", insertDataOption: "INSERT_ROWS" },
      data: { values: [[name, address]] },
      retry: false,
    });
  } catch {
    // Avoid logging credentials or attendee data from the upstream request.
    console.error("Could not append attendance to Google Sheets.");
    return Response.json(
      { message: "Couldn’t confirm your check-in. Please contact the organizer." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
