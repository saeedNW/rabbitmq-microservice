/** import amqplib module */
const amqplib = require("amqplib");
/** import order model */
const { orderModel } = require("../model/order.model");
/** define a variable in order to save the channel */
let channel;

/**
 * Connects to a RabbitMQ server and creates a channel.
 * @returns {Promise<Object>} A Promise that resolves with the created channel object.
 */
const connectToChannel = async () => {
	try {
		/** Attempt to connect to the RabbitMQ server */
		const connection = await amqplib.connect("amqp://localhost:5672");

		/**
		 * If connection is successful, create a channel
		 * return created channel
		 */
		return await connection.createChannel();
	} catch (error) {
		/** If an error occurs during connection or channel creation, log an error message */
		console.error("Can't connect to RabbitMQ server:", error.message);
	}
};

/**
 * Returns a channel by either using an existing one or creating a new one.
 * @returns {Promise<Object>} A Promise that resolves with the channel object.
 */
const returnChannel = async () => {
	/** If a channel doesn't exist (or is falsy), attempt to create a new one */
	if (!channel) {
		/** Call the connectToChannel function to create a new channel */
		channel = await connectToChannel();
	}

	/** Return the channel (either the existing one or the newly created one) */
	return channel;
};

/**
 * Creates a queue with the given name using a channel.
 * @param {string} queueName The name of the queue to be created.
 * @returns {Promise<{ channel: Object, queueDetail: Object }>} A Promise that resolves with an object containing the channel and queue details.
 */
const createQueue = async (queueName) => {
	/** Obtain the channel either by creating a new one or using an existing one */
	let myChannel = await returnChannel();

	/** Assert the queue with the given name on the channel */
	const queueDetail = await myChannel.assertQueue(queueName);

	/** Return an object containing the channel and queue details */
	return { channel: myChannel, queueDetail };
};

/**
 * Pushes data to a queue with the given name.
 * @param {string} queueName The name of the queue to push data into.
 * @param {any} data The data to be pushed into the queue.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully pushed to the queue.
 */
const pushToQueue = async (queueName, data) => {
	try {
		/** Assert the queue with the given name on the channel */
		await channel.assertQueue(queueName);

		/** Send data to the queue */
		return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
	} catch (error) {
		/** If an error occurs, log the error message */
		console.error(error.message);
	}
};

/**
 * Creates an order using a queue for processing.
 * @param {string} queueName The name of the queue to be used.
 */
const createOrderWithQueue = async (queueName) => {
	/** Create the queue if it doesn't exist */
	await createQueue(queueName);

	/** Consume messages from the queue */
	channel.consume(queueName, async (msg) => {
		if (msg.content) {
			/** Parse the message content to extract product information and user email */
			const { products, userEmail } = JSON.parse(msg.content.toString());

			/** Calculate the total price of the products */
			const totalPrice = products
				.map((p) => +p.price)
				.reduce((prev, curr) => prev + curr, 0);

			/** Create a new order document */
			const newOrder = new orderModel({
				products,
				userEmail,
				totalPrice,
			});

			/** Save the new order to the database */
			await newOrder.save();

			/** Acknowledge the message from the queue */
			channel.ack(msg);

			/** Push the new order to the PRODUCT queue for further processing */
			pushToQueue("PRODUCT", newOrder);

			/** Log the ID of the saved order */
			console.log("Saved order:", newOrder._id);
		}
	});
};

module.exports = {
	returnChannel,
	pushToQueue,
	connectToChannel,
	createQueue,
	createOrderWithQueue,
};
