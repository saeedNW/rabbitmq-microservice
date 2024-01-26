/** import mongoose m */
const { default: mongoose } = require("mongoose");

/** create a new mongoose schema for user */
const userSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		password: String,
	},
	{ timestamps: true }
);

/** initialize mongoose model */
const userModel = mongoose.model("user", userSchema);

module.exports = {
	userModel,
};
