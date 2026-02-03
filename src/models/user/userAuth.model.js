// src/models/user/userAuth.model.js
// =====================================================

import mongoose from "mongoose";

// ===================== USER MODEL =====================
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 30,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
