//import target resolver path
export const routePath = require("path").join(__dirname, "../../app/controllers/v1/uploadController");

export const routes = [
	{ method: "post", endPoint: "createAccount@createAccount" },
	{ method: "post", endPoint: "createDocument@createDocument" },
	{ method: "post", endPoint: "createGrant@createGrant" },
	{ method: "get", endPoint: "processGrant@processGrant/:grantId/:uploadId" },
	{ method: "post", endPoint: "decryptData@decryptData" },


	{ method: "get", endPoint: "getGrants@getGrants" },
	{ method: "get", endPoint: "getUploads@getUploads" },
	{ method: "get", endPoint: "ping@ping" },
];