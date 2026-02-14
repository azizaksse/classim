import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// --- 1. Load Environment Variables (Simple Parser) ---
function loadEnv() {
    const envFiles = ['.env.local', '.env'];

    for (const file of envFiles) {
        const envPath = path.resolve(process.cwd(), file);
        if (fs.existsSync(envPath)) {
            console.log(`✅ Loading environment from ${file}`);
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    let value = match[2].trim();
                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    process.env[match[1].trim()] = value;
                }
            });
            return true; // Stop after loading the first valid one (priority)
        }
    }

    console.error('❌ No .env or .env.local file found.');
    return false;
}

// --- 2. Main Verification Function ---
async function verifyConnection() {
    console.log('🔍 Starting Google Sheets Connection Verification...');

    if (!loadEnv()) return;

    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    // Handle escaped newlines in private key
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    console.log('\n--- Configuration ---');
    console.log('📧 Client Email:', clientEmail ? 'Set ✅' : 'Missing ❌');
    console.log('🔑 Private Key:', privateKey ? 'Set (Length: ' + privateKey.length + ') ✅' : 'Missing ❌');
    console.log('📄 Spreadsheet ID:', spreadsheetId ? 'Set ✅' : 'Missing ❌');

    if (!clientEmail || !privateKey || !spreadsheetId) {
        console.error('\n❌ Error: Missing required environment variables.');
        console.log('Please ensure GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID are set in your .env file.');
        return;
    }

    try {
        console.log('\n🔄 Authenticating...');
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        console.log('🔄 Attempting to append a test row...');

        // Octomatic Format Test
        const values = [[
            "TEST-DATE", "Test Customer", "0555123456", "Test Wilaya", "Test City", "Test Address", "Test Product", 1, 0, "Test Note"
        ]];

        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A:A",
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });

        console.log('\n✅ FAILURE PROOF CONNECTION SUCCEEDED!');
        console.log(`Updated Range: ${res.data.updates.updatedRange}`);
        console.log('Please check your Google Sheet for the test row.');

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED:');
        console.error(error.message);

        if (error.message.includes('invalid_grant')) {
            console.log('\n💡 Tip: This usually means the PRIVATE KEY is incorrect or malformed.');
            console.log('Check that you copied the ENTIRE key using the copy button from the Google Cloud Console or JSON file.');
            console.log('It should verify it starts with -----BEGIN PRIVATE KEY----- and ends with -----END PRIVATE KEY-----');
        } else if (error.message.includes('insufficient_permissions') || error.code === 403) {
            console.log('\n💡 Tip: The Service Account does not have permission to edit the sheet.');
            console.log(`Please Share the Google Sheet with: ${clientEmail}`);
            console.log('Give it "Editor" permissions.');
        } else if (error.code === 404) {
            console.log('\n💡 Tip: Spreadsheet not found. Check the SPREADSHEET_ID.');
        }
    }
}

verifyConnection();
