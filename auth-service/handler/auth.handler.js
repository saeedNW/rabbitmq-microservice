/** initialize auth router */
const authRouter = require("express").Router();
/** import user model */
const { userModel } = require("../model/user.model");
/** import json web token module */
const jwt = require("jsonwebtoken");

/** register process handler */
authRouter.post("/register", async (req, res, next) => {
	try {
		/** extract data from request body */
		const { name, email, password } = req.body;
		/** check user existence */
		const existUser = await userModel.findOne({ email });
		/** throw error if the user was already exists */
		if (existUser) throw { message: "user already exist" };
		/** create new user from user model */
		const newUser = new userModel({
			name,
			email,
			password,
		});
		/** save user data in database */
		await newUser.save();
		/** send success response */
		return res.json({
			message: "new user created",
		});
	} catch (err) {
		next(err);
	}
});

/** login process handler */
authRouter.post("/login", async (req, res, next) => {
	try {
		/** extract data from request body */
		const { email, password } = req.body;
		/** retrieve user data from database */
		const existUser = await userModel.findOne({ email }, { __v: 0 });
		/** throw error if user was notfound */
		if (!existUser) throw { message: "user not found" };
		/** throw error if the password was not match */
		if (existUser.password !== password)
			throw { message: "password incorrect" };
		/** remove user  password  from retrieved data */
		delete existUser.password;
		/** create json web token from user data */
		jwt.sign(
			{ email, id: existUser._id, name: existUser.name },
			"secretKey",
			(err, token) => {
				if (!err) return res.json({ token });
				return res.json({ error: err.message });
			}
		);
	} catch (error) {
		next(error);
	}
});

module.exports = {
	authRouter,
};
