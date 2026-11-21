# Attendance tracker

A mobile-friendly Next.js form with two text fields. Each submission adds a Name and Address row to a private Google Sheet.

## Connect Google Sheets

1. Create a Google Sheet. Rename the tab to `Attendance`, set cell `A1` to `Name`, and set cell `B1` to `Address`.
2. Open the spreadsheet and copy its ID from the URL. It is the text between `/d/` and `/edit`.
3. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project and [enable the Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
4. In **IAM & Admin → Service Accounts**, create a service account for the tracker. In its **Keys** tab, select **Add key → Create new key → JSON** and download the file. [Google's service account setup guide](https://developers.google.com/workspace/guides/create-credentials)
5. In the spreadsheet's **Share** dialog, add the service account's `client_email` as an **Editor**. Keep general access set to **Restricted**.

## Run on Windows

Keep the downloaded JSON in a private folder outside the Git repository and Laragon's web root. Use the existing `.env.local` file or create it if needed, then set these two values:

```dotenv
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=C:/path/to/service-account.json
```

Use forward slashes in the path. When the JSON path is set, the app reads the service account email and key directly from that file. Keep the JSON and the private key out of the README and Git history.

```powershell
cd C:\laragon\www\attendance-tracker
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000), submit a sample name and address, and check for a new row in the `Attendance` tab. Restart the local server if you changed `.env.local` while it was running.

## Deploy and share

1. In [Vercel](https://vercel.com/new), import the GitHub repository using the Next.js preset.
2. In **Settings → Environment Variables**, add the following variables for **Production**. Copy the full private key value, including its BEGIN and END lines, without the JSON string's surrounding quotes. If the project is already deployed, redeploy after saving the variables. [Vercel's environment variable guide](https://vercel.com/docs/environment-variables/managing-environment-variables)

   | Variable | Value |
   | --- | --- |
   | `GOOGLE_SHEETS_SPREADSHEET_ID` | The spreadsheet ID from its URL |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The JSON file's `client_email` value |
   | `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | The JSON file's `private_key` value |

3. Open the production URL on a phone and submit a sample entry. Use that production URL to generate the QR code once the row appears in the sheet.
