// ===============================
// src/utils/generateGmailToken.js
// ===============================

// ===============================
import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";
// ===============================

// ===============================
dotenv.config();
// ===============================

// =========================== Generate Gmail API Token ===========================
const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI } =
	process.env;

const oAuth2Client = new google.auth.OAuth2(
	GMAIL_CLIENT_ID,
	GMAIL_CLIENT_SECRET,
	GMAIL_REDIRECT_URI,
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl = oAuth2Client.generateAuthUrl({
	access_type: "offline", // Important for refresh token
	scope: SCOPES,
});

console.log("\n1️⃣  Authorize this app by visiting this URL:\n");
console.log(authUrl);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("\n2️⃣  Paste the code from that page here: ", async (code) => {
	try {
		const { tokens } = await oAuth2Client.getToken(code);
		console.log("\n🎉 Your new tokens are:\n", tokens);
		console.log(
			"\n✅ Copy the refresh_token to your .env file as GMAIL_REFRESH_TOKEN\n",
		);
	} catch (err) {
		console.error("Error retrieving access token:", err);
	} finally {
		rl.close();
	}
});
