/** import mongoose model */
const { default: mongoose } = require("mongoose");

/** create a new mongoose schema for order */
const orderSchema = new mongoose.Schema(
	{
		products: [
			{
				_id: String,
			},
		],
		userEmail: String,
		totalPrice: Number,
	},
	{ timestamps: true }
);

/** initialize mongoose model */
const orderModel = mongoose.model("order", orderSchema);

module.exports = {
	orderModel,
};
