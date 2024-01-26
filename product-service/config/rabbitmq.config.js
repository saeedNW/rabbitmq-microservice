/** import amqplib module */
const amqplib = require("amqplib");
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
		/** Obtain the channel either by creating a new one or using an existing one */
		await returnChannel();

		/** Assert the queue with the given name on the channel */
		await channel.assertQueue(queueName);

		/** Send data to the queue */
		return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
			persistent: true,
		});
	} catch (error) {
		/** If an error occurs, log the error message */
		console.error(error.message);
	}
};

module.exports = {
	returnChannel,
	pushToQueue,
	createQueue,
	connectToChannel,
};
