# Attendance tracker

A mobile-friendly Next.js form with two text fields. Each submission adds a Name and Address row to a private Google Sheet.

## Connect Google Sheets

1. Create a Google Sheet. Rename the tab to `Attendance`, set cell `A1` to `Name`, and set cell `B1` to `Address`.
2. Open the spreadsheet and copy its ID from the URL. It is the text between `/d/` and `/edit`.
3. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project and [enable the Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
4. In **IAM & Admin → Service Accounts**, create a service account for the tracker. In its **Keys** tab, select **Add key → Create new key → JSON** and download the file. The app needs the file's `client_email` and `private_key` values. See [Google's service account setup guide](https://developers.google.com/workspace/guides/create-credentials).
5. In the spreadsheet's **Share** dialog, add the service account's `client_email` as an **Editor**. Keep general access set to **Restricted**.
6. From this project folder, run `Copy-Item .env.example .env.local` in PowerShell, then fill in the three values in `.env.local`.

```dotenv
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=the_client_email_from_your_key_file
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
```

Paste the full `private_key` value, including the BEGIN and END lines. Keep the downloaded JSON outside the repository. Git ignores `.env.local`.

## Run on Windows

```powershell
cd C:\laragon\www\attendance-tracker
npm.cmd ci
npm.cmd run dev
```

Open [localhost:3000](http://localhost:3000), submit a sample name and address, and check for a new row in the `Attendance` tab. Restart the local server if you changed `.env.local` while it was running.

## Deploy and share

1. In [Vercel](https://vercel.com/new), import the GitHub repository using the Next.js preset.
2. Add the same three variables under **Environment Variables** for **Production**. Paste the private key value without surrounding quote characters. If the project is already deployed, redeploy after adding the variables. See [Vercel's environment variable guide](https://vercel.com/docs/environment-variables/managing-environment-variables).
3. Open the production URL on a phone and submit a sample entry. Use that production URL to generate the QR code once the row appears in the sheet.
