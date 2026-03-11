// ===============================
// src/config/cloudinary.js
// Description: This file sets up the Cloudinary configuration for the application, including the cloud name, API key, and API secret. It also defines a CloudinaryStorage instance for handling avatar uploads with specific parameters such as allowed formats and transformations. Finally, it exports both the upload middleware for handling avatar uploads and the configured Cloudinary instance for use in other parts of the application.
// Wagon, let's keep building this awesome app!  bro
// ===============================
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import env from "./env.js";

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
	cloud_name: env.cloudinary.cloudName,
	api_key: env.cloudinary.apiKey,
	api_secret: env.cloudinary.apiSecret,
});

// ================= CLOUDINARY STORAGE =================
const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "taxlator/avatars",
		allowed_formats: ["jpg", "jpeg", "png", "webp"],
		transformation: [{ width: 500, height: 500, crop: "fill" }],
	},
});

// ================= MULTER UPLOAD MIDDLEWARE =================
export const uploadAvatarMiddleware = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
	fileFilter: (_req, file, cb) => {
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Invalid file type. Only JPEG, PNG, and WEBP are allowed.",
				),
				false,
			);
		}
	},
}).single("avatar"); // "avatar" = form field name frontend must use

// ===============================
export default cloudinary;