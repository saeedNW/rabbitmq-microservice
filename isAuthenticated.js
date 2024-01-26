const jwt = require("jsonwebtoken");

/**
 * Middleware function to check if the request is authenticated using JWT.
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {function} next The next middleware function.
 */
async function isAuthenticated(req, res, next) {
	try {
		/** Extract the JWT token from the authorization header */
		const token = req.headers?.["authorization"]?.split(" ")[1];

		/** Verify the JWT token */
		jwt.verify(token, "secretKey", (err, payload) => {
			if (err) return res.json({ error: err });
			/** If token is verified successfully, attach the payload to the request object */
			req.user = payload;
			/** Call the next middleware function */
			next();
		});
	} catch (error) {
		/** If an error occurs, return a JSON response with the error message */
		return res.json({ error: error.message });
	}
}

module.exports = {
	isAuthenticated,
};
