# TAXLATOR BACKEND API DOCUMENTATION

This document contains all available backend API endpoints for the Taxlator project.

---

## BASE URL

https://group12-taxlator-api.onrender.com

## API DOCUMENTATION

https://group12-taxlator-api.onrender.com/docs/API_DOCUMENTATION.pdf

---

## HEALTH CHECK 🩺

Used to confirm that the backend service is running.

| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| GET    | /health  | Confirms the API is live |

---

## AUTHENTICATION ENDPOINTS 🔐

### SIGNUP

Register a new user. A 6-digit verification code is sent to the user’s email. User must verify their email before calculation records can be saved.

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/auth/signup | Create a new user |

---

### VERIFY EMAIL

Verify a user’s email using the code sent at signup.

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | /api/auth/verify-email | Verify email with code |

---

### SEND VERIFICATION CODE

Send a new verification code if the previous code expired or was lost.

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | /api/auth/send-code | Send verification code |

---

### SIGN-IN

Authenticate an existing verified user and return a JWT. Only verified users can sign-in successfully.

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | /api/auth/signin | Signin an existing user |

---

### CHANGE PASSWORD

Allows a logged-in user to change their password. Requires JWT authentication.

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/auth/change-password | Change password |

---

### FORGOT PASSWORD

Sends a password reset code to the user’s email.

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/auth/forgot-password | forgot password |

---

### RESET PASSWORD

Resets a user’s password using the reset code sent to email.

| Method | Endpoint                 | Description    |
| ------ | ------------------------ | -------------- |
| POST   | /api/auth/reset-password | reset password |

---

### SIGN-OUT

Clear authentication cookie and logout.

| Method   | Endpoint          | Description  |
| -------- | ----------------- | ------------ |
| GET/POST | /api/auth/signout | Signout user |

---

## CALCULATION ENDPOINTS 💰

Both Tax and VAT endpoints are dual-purpose:

1. Public users can calculate without signing up (records will not be saved).
2. Verified users can calculate and their results will be saved to their history.

### TAX - PUBLIC

| Method | Endpoint                      | Description         | Note                              |
| ------ | ----------------------------- | ------------------- | --------------------------------- |
| POST   | /api/tax/payePit/calculate    | Calculator endpoint | if user is valid, record is saved |
| POST   | /api/tax/cit/calculate        | Calculator endpoint | if user is valid, record is saved |
| POST   | /api/tax/freelancer/calculate | Calculator endpoint | if user is valid, record is saved |

---

### TAX - PRIVATE

| Method | Endpoint                           | Description         | Note                              |
| ------ | ---------------------------------- | ------------------- | --------------------------------- |
| POST   | /api/tax/payePit/calculate/save    | Calculator endpoint | if user is valid, record is saved |
| POST   | /api/tax/cit/calculate/save        | Calculator endpoint | if user is valid, record is saved |
| POST   | /api/tax/freelancer/calculate/save | Calculator endpoint | if user is valid, record is saved |

---

### VAT - PUBLIC

| Method | Endpoint           | Description         | Note                              |
| ------ | ------------------ | ------------------- | --------------------------------- |
| POST   | /api/vat/calculate | Calculator endpoint | if user is valid, record is saved |

---

### VAT - PRIVATE

| Method | Endpoint                | Description         | Note                              |
| ------ | ----------------------- | ------------------- | --------------------------------- |
| POST   | /api/vat/calculate/save | Calculator endpoint | if user is valid, record is saved |

---

## STATUS CODES ⚠

- `200` – Successs
- `201` – Successs / new resourse created
- `400` – Bad request / validation error
- `401` – Unauthorized / invalid token
- `403` – Forbidden / email not verified
- `404` – Resource not found
- `500` – Server error
