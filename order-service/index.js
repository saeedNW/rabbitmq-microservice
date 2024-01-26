/** import express module */
/** initialize mongoose connection */
require("./config/mongoose.config");
/** import order queue consumer */
const { createOrderWithQueue } = require("./config/rabbitmq.config");
/** initialize order queue */
createOrderWithQueue("ORDER");
