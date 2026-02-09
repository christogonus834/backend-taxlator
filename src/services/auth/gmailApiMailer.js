// src/services/auth/gmailApiMailer.js

// ==================================================
import { google } from "googleapis";

// ======================== UTILITIES ========================
function base64UrlEncode(str) {
	return Buffer.from(str)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

// Encode subjects with emojis / special characters
function encodeSubject(subject) {
	return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
}

function buildRawEmail({ from, to, subject, html, text }) {
	const boundary = "taxlator_boundary_" + Date.now();

	const safe = (v) =>
		String(v || "")
			.replace(/\r|\n/g, " ")
			.trim();

	const lines = [
		`From: ${safe(from)}`,
		`To: ${safe(to)}`,
		`Subject: ${encodeSubject(subject)}`, // emoji-safe
		"MIME-Version: 1.0",
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		"",
		`--${boundary}`,
		'Content-Type: text/plain; charset="UTF-8"',
		"Content-Transfer-Encoding: base64",
		"",
		Buffer.from(text || " ").toString("base64"),
		"",
		`--${boundary}`,
		'Content-Type: text/html; charset="UTF-8"',
		"Content-Transfer-Encoding: base64",
		"",
		Buffer.from(html || "<p> </p>").toString("base64"),
		"",
		`--${boundary}--`,
		"",
	];

	return base64UrlEncode(lines.join("\r\n"));
}

function extractGoogleError(err) {
	const data = err?.response?.data || err?.errors?.[0] || err;

	return {
		status: err?.code || err?.response?.status || 500,
		error: data?.error || err?.message || "Gmail API request failed",
		description: data?.error_description || data?.message || "",
	};
}

// ======================== ENV ========================
const {
	GMAIL_CLIENT_ID,
	GMAIL_CLIENT_SECRET,
	GMAIL_REFRESH_TOKEN,
	GMAIL_SENDER,
} = process.env;

if (
	!GMAIL_CLIENT_ID ||
	!GMAIL_CLIENT_SECRET ||
	!GMAIL_REFRESH_TOKEN ||
	!GMAIL_SENDER
) {
	console.warn("⚠️ Gmail API environment variables are missing");
}

// ======================== OAUTH ========================
const oauth2Client =
	GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET
		? new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET)
		: null;

if (oauth2Client && GMAIL_REFRESH_TOKEN) {
	oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
}

// ======================== SEND MAIL ========================
async function sendGmail({ to, subject, html, text }) {
	if (
		!GMAIL_CLIENT_ID ||
		!GMAIL_CLIENT_SECRET ||
		!GMAIL_REFRESH_TOKEN ||
		!GMAIL_SENDER
	) {
		const err = new Error("Missing Gmail API environment variables");
		err.status = 500;
		throw err;
	}

	const auth =
		oauth2Client ||
		new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);

	auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

	const gmail = google.gmail({ version: "v1", auth });

	const raw = buildRawEmail({
		from: `Taxlator (Group12.tech) <${GMAIL_SENDER}>`,
		to,
		subject,
		html,
		text,
	});

	try {
		return await gmail.users.messages.send({
			userId: "me",
			requestBody: { raw },
		});
	} catch (err) {
		const gErr = extractGoogleError(err);
		const e = new Error(
			gErr.description
				? `Gmail API error: ${gErr.error} (${gErr.description})`
				: `Gmail API error: ${gErr.error}`,
		);
		e.status = gErr.status;
		throw e;
	}
}

export { sendGmail };
