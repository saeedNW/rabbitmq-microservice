/** import mongoose model */
const { default: mongoose } = require("mongoose");

/** create a new mongoose schema for product */
const productSchema = new mongoose.Schema(
	{
		name: String,
		desc: String,
		price: Number,
	},
	{ timestamps: true }
);
/** initialize mongoose model */
const productModel = mongoose.model("product", productSchema);

module.exports = {
	productModel,
};
