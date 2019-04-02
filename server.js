

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
let cors = require("cors");
const web3 = require("web3");
const redis = require("redis");
const fileUpload = require("express-fileupload");

import loggerClient from "./app/client/loggerClient";
import redisHelper from "./app/helper/redisHelper";
import blockchainClient from "./app/client/blockchainClient";
import * as constant from "./app/helper/constant";
import * as contractHelper from "./app/helper/contractHelper";

import * as keyHelper from "./app/helper/keyHelper";

global.__base = __dirname;

const app = express();
const server = require("http").createServer(app);

app.web3Client = null;
app.redisClient = null;
app.loggerClient = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
	limits: { fileSize: constant.FILE_UPLOAD_LIMIT },
	safeFileNames: true,
	abortOnLimit: true
}));

// setup logger
app.loggerClient = loggerClient;

require("events").EventEmitter.prototype._maxListeners = 100;

//setup mongoose
app.db = mongoose.createConnection(constant.config.mongodb.uri, constant.config.options); // TODO :: pooling, sharding (00,01,02)
app.db.on("error", console.error.bind(console, "mongoose connection error: "));
app.db.once("open", () => {
	console.log(constant.config.mongodb.uri);
	//setup redis
	const redisClient = redis.createClient(constant.config.redisConfig);
	redisClient.on("error", err => console.log(err));
	redisClient.on("ready", async () => {

		// init redis
		app.redisClient = redisClient;
		app.redisHelper = redisHelper(redisClient);

		//init web3
		const provider = new web3.providers.HttpProvider(constant.config.blockchainNode.url);
		const web3Client = new web3(provider);
		if (await web3Client.eth.net.isListening()) {
			app.web3Client = web3Client;
			app.loggerClient("WEB3", "Initialized web3");
		} else {
			app.loggerClient("WEB3", "Unable to initialized web3");
			return null;
		}

		app.web3Helper = blockchainClient(web3Client);

		// init contract
		const contractInstance = await app.web3Helper.initializeContract(constant.CONTRACT_ADDRESS, constant.BINARY_ABI);
		contractHelper.addContract("VLD", contractInstance);

		process.on("unhandledRejection", (reason, promise) => {
			console.error("Uncaught error in", promise, reason);
		});
	});
});

require("./engine").default(app, mongoose);
server.listen(constant.config.port, constant.config.host, async () => {
	console.log("APP", `Server running on port ${constant.config.port} and on host ${constant.config.host}.....`);
	process.on("unhandledRejection", (reason, promise) => {
		console.log("APP_ERROR", `Uncaught error in ${String(reason)}`, promise);
	});

	console.log(await keyHelper.getLocalPrivateKey(app, constant.config.wallet.transferWalletAccountAddress, constant.config.wallet.transferWalletAccountKey));
});