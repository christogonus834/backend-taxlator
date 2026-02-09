// src/controllers/auth/index.js

// ===============================
// ===============================
import * as signupController from "./signup.controller.js";
import * as signinController from "./signin.controller.js";
import * as verifyController from "./verify.controller.js";
import * as userController from "./user.controller.js";
import * as forgotResetController from "./forgotReset.controller.js";
import * as checkEmailController from "./checkEmail.controller.js";

function onlyFunctions(module) {
	return Object.fromEntries(
		Object.entries(module).filter(([, value]) => typeof value === "function"),
	);
}

const AuthController = {
	...onlyFunctions(signupController),
	...onlyFunctions(signinController),
	...onlyFunctions(verifyController),
	...onlyFunctions(userController),
	...onlyFunctions(forgotResetController),
	...onlyFunctions(checkEmailController),
};

export default AuthController;
