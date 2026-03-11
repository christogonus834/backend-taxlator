// ===============================
// src/user/userProfile.controller.js
// Description: This file defines the controller function for handling avatar uploads in the user profile. It checks for the presence of an uploaded file, manages existing avatars by deleting them from Cloudinary if necessary, and updates or creates the user's profile settings with the new avatar information. The function also includes error handling for various scenarios such as missing files, file size limits, and invalid file types.
//Wagon, let's keep building this awesome app!  bro
// ===============================
import cloudinary from "../config/cloudinary.js";
import ProfileSettings from "../user/userProfile.model.js";

// ================= UPLOAD AVATAR =================
export const uploadAvatar = async (req, res) => {
	try {
		// 1. Check if file was attached
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded. Please attach an image.",
			});
		}

		const userId = req.user._id;

		// 2. Find existing profile settings for this user
		let profile = await ProfileSettings.findOne({ userId });

		// 3. If user already has an avatar, delete old one from Cloudinary
		if (profile?.avatarPublicId) {
			await cloudinary.uploader.destroy(profile.avatarPublicId);
		}

		// 4. Get the new Cloudinary URL and publicId from uploaded file
		const avatarUrl = req.file.path;          // Cloudinary secure URL
		const avatarPublicId = req.file.filename; // Cloudinary public_id

		// 5. Update or create profile with new avatar
		if (profile) {
			profile.avatarUrl = avatarUrl;
			profile.avatarPublicId = avatarPublicId;
			await profile.save();
		} else {
			profile = await ProfileSettings.create({
				userId,
				avatarUrl,
				avatarPublicId,
			});
		}

		// 6. Return success response
		return res.status(200).json({
			success: true,
			message: "Avatar uploaded successfully.",
			data: {
				avatarUrl: profile.avatarUrl,
			},
		});
	} catch (error) {
		console.error("uploadAvatar error:", error);

		// Handle Multer file size error
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				message: "File too large. Maximum allowed size is 5MB.",
			});
		}

		// Handle invalid file type error (thrown from fileFilter)
		if (error.message?.includes("Invalid file type")) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		// Generic server error
		return res.status(500).json({
			success: false,
			message: "Server error. Could not upload avatar.",
		});
	}
};