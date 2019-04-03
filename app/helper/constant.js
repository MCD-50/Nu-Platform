const configServer = require("../../configServer");
export const config = configServer;

export const CONTRACT_ADDRESS = "0xf5609d4f9d23525dcd056abeba700f82110204cb";
export const BINARY_ABI = `[
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "idUploadObject",
		"outputs": [
			{
				"name": "customerAddress",
				"type": "address"
			},
			{
				"name": "ciphertext",
				"type": "string"
			},
			{
				"name": "capsuleId",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "idGrantObject",
		"outputs": [
			{
				"name": "policyId",
				"type": "string"
			},
			{
				"name": "capsuleId",
				"type": "string"
			},
			{
				"name": "signedPublicKey",
				"type": "string"
			},
			{
				"name": "pubKey",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "policyId",
				"type": "string"
			}
		],
		"name": "getGrant",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "policyId",
				"type": "string"
			},
			{
				"name": "capsuleId",
				"type": "string"
			},
			{
				"name": "signedPublicKey",
				"type": "string"
			},
			{
				"name": "pubKey",
				"type": "string"
			}
		],
		"name": "addGrant",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getGrantId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCurrentId",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "capsuleId",
				"type": "string"
			}
		],
		"name": "getDocument",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "ciphertext",
				"type": "string"
			},
			{
				"name": "capsuleId",
				"type": "string"
			}
		],
		"name": "addDocument",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`;

export const FILE_UPLOAD_LIMIT = 50 * 1024 * 1024;