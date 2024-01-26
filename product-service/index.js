/** import express module */
const express = require("express");
/** create app instants */
const app = express();
/** require and config env file */
require("dotenv").config();
/** define port number */
const PORT = parseInt(process.env.PORT, 10) || 3000;
/** initialize mongoose connection */
require("./config/mongoose.config");
/** config express json body parser */
app.use(express.json());
/** config express url encoded body parser */
app.use(express.urlencoded({ extended: true }));
/** import product router */
const { productRouter } = require("./handler/product.handler");
/** initialize product router */
app.use("/product", productRouter);
/** config router not found error */
app.use((req, res, next) => {
	return res.status(404).json({ message: "Notfound" });
});
/** config error handler */
app.use((error, req, res, next) => {
	return res.status(500).json({ message: error.message });
});
/** start server */
app.listen(PORT, () => {
	console.log(`product service running on http://localhost:${PORT}`);
});
