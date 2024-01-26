# RabbitMQ Microservice

This Node.js learning project focuses on understanding RabbitMQ microservices. In
this project, I have developed three simple services which are responsible for
`authentication`, `product management`, and `order management`.

## Services Structure and Workflow

- The `authentication` service is responsible for user register and login processes.
- The `product` service is responsible for product creation and buying processes.
- The `order` service is responsible for order creation processes.

The `product` and `order` services, process and connect to each other through RabbitMQ
queues.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (latest version)
- [Docker](https://www.docker.com/) (latest version)

## Setting Up RabbitMQ with Docker

To set up RabbitMQ using Docker, run the following command in your terminal:

```bash
docker run -d -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

This command pulls the RabbitMQ Docker image and starts a container with RabbitMQ
running. The RabbitMQ management console will be accessible at [http://localhost:15672](http://localhost:15672) (username: guest, password: guest).

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/saeedNW/rabbitmq-microservice.git
   ```

2. Navigate to the project directory:

   ```shell
   cd rabbitmq-microservice
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

4. Ensure RabbitMQ is running using Docker (as specified in the "Setting Up RabbitMQ with Docker" section).

5. Follow the instructions for testing each service as described in the
   "Instructions for Testing Each service" section.

## Instructions for Testing Each Service

### Auth Service

To start and use the `auth` service follow these steps:

1. Open a new terminal instants and navigate to auth service directory

   ```bash
   cd auth-service/
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Start authenticate service:

   ```bash
   npm run dev
   ```

After starting the authentication service you can use the postman collection file in
the project root directory to create a user and login to system.

### Order Service

The order service is responsible for managing order queue so the only thing you need
to do for it is to run it and let it be.

To start the `order` service follow theses steps:

1. Open a new terminal instants and navigate to order service directory

   ```bash
   cd order-service/
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Start order service:

   ```bash
   npm run dev
   ```

### Product service

To start and use the `product` service follow these steps:

1. Open a new terminal instants and navigate to product service directory

   ```bash
   cd product-service/
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Start product service:

   ```bash
   npm run dev
   ```

After starting the product service you can use the postman collection file in
the project root directory to create and buy a product. After registering a buy
request you can start monitoring the order and product services terminal to see the
result of RabbitMQ processes.

You can also monitor the process by opening the RabbitMQ manager web page in
[http://localhost:15672](http://localhost:15672) (username: guest, password: guest).

## Contributors

We would like to thank the following individuals who have contributed to the
development of this project:

![avatar](https://images.weserv.nl/?url=https://github.com/erfanyousefi.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)
‎ ‎
‎ ![avatar](https://images.weserv.nl/?url=https://github.com/saeedNW.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)

[**Erfan Yousefi - Supervisor and instructor of the node.js programming course**](https://github.com/erfanyousefi/)

[**Saeed Norouzi - Back-end Developer**](https://github.com/saeedNW)
