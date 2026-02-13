// ===============================
// src/auth/index.js
// ===============================

// ===============================
import * as signupController from "./signup.controller.js";
import * as signinController from "./signin.controller.js";
import * as verifyController from "./verify.controller.js";
import * as userController from "./user.controller.js";
import * as forgotResetController from "./forgotReset.controller.js";
import * as checkEmailController from "./checkEmail.controller.js";
// ===============================

// ===============================
function onlyFunctions(module, moduleName = "unknown") {
	const functions = Object.fromEntries(
		Object.entries(module).filter(([key, value]) => {
			if (typeof value !== "function") {
				console.warn(
					`⚠️ ${key} in ${moduleName} is not a function and will be skipped`,
				);
				return false;
			}
			return true;
		}),
	);

	if (Object.keys(functions).length === 0) {
		console.error(`❌ No functions exported from ${moduleName}!`);
	} else {
		console.log(
			`✅ Functions imported from ${moduleName}:`,
			Object.keys(functions),
		);
	}

	return functions;
}

const AuthController = {
	...onlyFunctions(signupController, "signupController"),
	...onlyFunctions(signinController, "signinController"),
	...onlyFunctions(verifyController, "verifyController"),
	...onlyFunctions(userController, "userController"),
	...onlyFunctions(forgotResetController, "forgotResetController"),
	...onlyFunctions(checkEmailController, "checkEmailController"),
};
// ===============================
console.log("AuthController keys:", Object.keys(AuthController));
// ===============================

export default AuthController;
