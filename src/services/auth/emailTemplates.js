// ========================
// Centralized Email Templates
// ========================

const BRAND = {
	product: "Taxlator",
	company: "Group12.tech",
	supportEmail: "taxlator.group@gmail.com",
	primaryColor: "#1d4ed8",
};

//  ======================== Base HTML wrapper  ========================
function baseTemplate({ title, body }) {
	return `
	<!DOCTYPE html>
	<html>
	<head><meta charset="UTF-8"><title>${title}</title></head>
	<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background:#f8fafc;">
		<table width="100%" cellpadding="0" cellspacing="0">
			<tr>
				<td align="center" style="padding:24px;">
					<table width="600" style="background:#ffffff; border-radius:8px; padding:24px;">
						<tr><td>
							<h2 style="color:${BRAND.primaryColor}; margin-top:0;">${title}</h2>
							${body}
							<hr style="margin:32px 0; border:none; border-top:1px solid #e5e7eb;" />
							<p style="font-size:12px; color:#555;">
								© ${new Date().getFullYear()} ${BRAND.company}<br/>
								${BRAND.product} is a product of ${BRAND.company}
							</p>
						</td></tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
	</html>
	`;
}

//  ======================== Verification Email (Signup) ========================
export function verificationEmail({ firstName, code }) {
	return {
		subject: "Verify your email – Taxlator",
		text: `
		Hello ${firstName},

		Welcome to Taxlator!

		Your verification code is: ${code}

		This code expires in 15 minutes.

		— Taxlator Team
		${BRAND.company}
		`.trim(),
		html: baseTemplate({
			title: "Verify your email",
			body: `
			<p>Hello <strong>${firstName}</strong>,</p>

			<p>Welcome to <strong>${BRAND.product}</strong>, a modern tax platform by <strong>${BRAND.company}</strong>.</p>

			<p>Please verify your email using the code below:</p>
			<div style="background:#f1f5f9; padding:16px; border-radius:8px; text-align:center; margin:24px 0;">
			<h1 style="letter-spacing:4px; margin:0;">${code}</h1>
			</div>
			<p>This code expires in <strong>15 minutes</strong>.</p>

			<p>If you did not create a Taxlator account, ignore this email.</p>
			`,
		}),
	};
}

//  ======================== Welcome Email (Post verification) ========================
export function welcomeEmail({ firstName }) {
	return {
		subject: "Welcome to Taxlator 🎉",
		text: `
		Hello ${firstName},

		Your email has been verified successfully!

		Welcome to Taxlator — a tax platform by Group12.tech. You can now calculate taxes, save records, and manage your account securely.

		— Taxlator Team
		${BRAND.company}
		`.trim(),
		html: baseTemplate({
			title: "Welcome to Taxlator 🎉",
			body: `
		<p>Hello <strong>${firstName}</strong>,</p>

		<p>Your email has been verified successfully.</p>

		<p><strong>${BRAND.product}</strong> helps you calculate taxes accurately and save your history.</p>
		<ul>
		<li>✔ Accurate tax calculations</li>
		<li>✔ Save and review tax history</li>
		<li>✔ Secure account access</li>
		</ul>

		<p>You can now sign in and start using Taxlator.</p>
			`,
		}),
	};
}

//  ======================== Resend Verification Code  ========================
export function resendVerificationEmail({ firstName, code }) {
	return {
		subject: "Your Taxlator verification code",
		text: `Hello ${firstName}, your verification code is ${code}. It expires in 15 minutes.`,
		html: baseTemplate({
			title: "Verification Code",
			body: `
		<p>Hello <strong>${firstName}</strong>,</p>

		<p>Your new verification code is:</p>

		<h2>${code}</h2>
		<p>This code expires in 15 minutes.</p>
			`,
		}),
	};
}

//  ======================== Forgot Password  ========================
export function forgotPasswordEmail({ firstName, code }) {
	return {
		subject: "Reset your Taxlator password",
		text: `
		Hello ${firstName},

		You requested a password reset.

		Your reset code is: ${code}

		This code expires in 15 minutes.

		— Taxlator Team
		${BRAND.company}
		`.trim(),
		html: baseTemplate({
			title: "Reset your password",
			body: `
		<p>Hello <strong>${firstName}</strong>,</p>

		<p>You requested a password reset. Use the code below to reset your password:</p>

		<div style="background:#f1f5f9; padding:16px; border-radius:8px; text-align:center; margin:24px 0;">

		<h1>${code}</h1>
		</div>
		<p>This code expires in <strong>15 minutes</strong>.</p>

		<p>If you did not request this, you can ignore this email.</p>
			`,
		}),
	};
}

//  ======================== Reset Password Success  ========================
export function resetPasswordSuccessEmail({ firstName }) {
	return {
		subject: "Your password has been reset",
		text: `
		Hello ${firstName},

		Your password has been successfully reset.

		You can now log in using your new password.

		— Taxlator Team
		${BRAND.company}
		`.trim(),
		html: baseTemplate({
			title: "Password Reset Successful",
			body: `
		<p>Hello <strong>${firstName}</strong>,</p>

		<p>Your password has been successfully reset.</p>

		<p>You can now log in using your new password.</p>
			`,
		}),
	};
}
