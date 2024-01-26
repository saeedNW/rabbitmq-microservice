/** initialize product router */
const productRouter = require("express").Router();
/** import product model */
const { productModel } = require("../model/product.model");
/** import authenticated checker */
const { isAuthenticated } = require("../../isAuthenticated");
/** import RabbitMQ manager functions */
const { pushToQueue, createQueue } = require("../config/rabbitmq.config");

/** product creation handler */
productRouter.post("/create", async (req, res, next) => {
	try {
		/** extract data from request body */
		const { name, desc, price } = req.body;
		/** create new product from product model */
		const newProduct = new productModel({
			name,
			desc,
			price,
		});
		/** save product data in database */
		await newProduct.save();
		/** send success response */
		return res.json({
			message: "a new product created",
			product: newProduct,
		});
	} catch (error) {
		next(error);
	}
});

/** buy product handler */
productRouter.post("/buy", isAuthenticated, async (req, res, next) => {
	try {
		/**
		 * extract data from request body
		 * set default value as empty array
		 */
		const { productId = [] } = req.body;
		/** retrieve product from database */
		const products = await productModel.find({ _id: { $in: productId } });
		/** retrieve user email from request */
		const { email: userEmail } = req.user;
		/** push the order products into RabbitMQ `ORDER` queue */
		await pushToQueue("ORDER", { products, userEmail });
		/** create product channel */
		const { channel, queueDetail } = await createQueue("PRODUCT");
		/** initialize channel consumer */
		let index = 0;
		channel.consume("PRODUCT", (msg) => {
			console.log(index, queueDetail.messageCount);
			channel.ack(msg);
		});
		/** send success message */
		return res.json({
			message: "your order created",
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = {
	productRouter,
};
