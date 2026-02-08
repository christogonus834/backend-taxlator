// src/controllers/auth/index.js

// ===============================
import * as signupController from "./signup.controller.js";
import * as signinController from "./signin.controller.js";
import * as verifyController from "./verify.controller.js";
import * as userController from "./user.controller.js";
import * as forgotResetController from "./forgotReset.controller.js";

const AuthController = {
	...signupController,
	...signinController,
	...verifyController,
	...userController,
	...forgotResetController,
};

export default AuthController;
