import * as collection from "../../helper/collection";
import * as constant from "../../helper/constant";
import * as ipfsNode from "../../client/ipfsNode";
import * as securityClient from "../../client/securityClient";
import mailClient from "../../client/mailClient";
const _mailClient = new mailClient();


import * as accountService from "../../service/accountService";
import * as uploadService from "../../service/uploadService";
import * as grantService from "../../service/grantService";

import contractHelper from "../../helper/contractHelper";

export const createAccount = async (req, res) => {
	if (req.body && req.body.password && req.body.email) {
		// first get address from web3
		const walletAddress = await req.app.web3Helper.newAccount(req.body.password);
		const nucypherAddresses = await securityClient.genkey();
		if (!nucypherAddresses) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		const result = {
			email: req.body.email,
			accountAddress: walletAddress,
			password: req.body.password,
			publicKey: nucypherAddresses.pubkey,
			privateKey: nucypherAddresses.privkey,
		};

		const _data = await accountService._createAccount(req.app, result);
		if (_data == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}
		return res.status(200).json({ result: result });
	} else {
		// send the from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const createUpload = async (req, res) => {
	if (req.files && req.files.file && req.body.walletAddress && req.body.password && req.body.detail) {
		const ipfs = await ipfsNode.getNode();

		const _account = await accountService._getAccountByFilter(req.app, { accountAddress: req.body.walletAddress });
		if (_account == null || _account.password != req.body.password) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		let fileformat = null;
		const file = req.files.file;

		if (file.mimetype && file.mimetype.split("/").length > 1) {
			fileformat = file.mimetype.split("/")[1];
		}

		if (fileformat == null) {
			return res.status(400).json(collection.getErrorResponse("File type not supported"));
		}

		const files = [{ path: file.name, content: file.data }];

		//now code to upload to ipfs
		ipfs.files.add(files, async (err, files) => {
			if (err) {
				throw err;
			}

			if (files.length > 0) {
				// call nucypher

				const encryptedDataPayload = await securityClient.encrypt(files[0].hash, _account.publicKey, _account.privateKey);
				if (!encryptedDataPayload) {
					return res.status(400).json(collection.getErrorResponse("Something went wrong"));
				}
				// call smart contract service

				const payload = {
					walletAddress: req.body.walletAddress,
					ciphertext: encryptedDataPayload.ciphertext,
					capsuleId: encryptedDataPayload.capsule_id,
				};

				const contractInstance = await getInstance(req.app);
				const _payload = contractInstance.methods.addDocument(payload.walletAddress, payload.ciphertext, payload.capsuleId).encodeABI();
				const trxPayload = {
					from: constant.config.wallet.transferWalletAccountAddress,
					to: constant.CONTRACT_ADDRESS,
					value: _payload,
					methodName: "addDocument",
					privateKey: constant.config.wallet.transferWalletAccountKey,
				};

				// send trx
				const txData = await req.app.web3Helper.sendRawErcTransaction(contractInstance, trxPayload);
				if (!txData.hash) {
					return res.status(400).json(collection.getErrorResponse("Unable to make blockchain transaction"));
				}

				const result = {
					accountAddress: req.body.walletAddress,
					detail: req.body.detail,
					ciphertext: encryptedDataPayload.ciphertext,
					capsuleId: encryptedDataPayload.capsule_id,
					transactionHash: txData.hash
				};

				// add to db
				const _data = await uploadService._createUpload(req.app, result);
				if (_data == null) {
					return res.status(400).json(collection.getErrorResponse("Something went wrong"));
				}

				return res.status(200).json({ result: _data });
			} else {
				return res.status(400).json(collection.getErrorResponse("Something went wrong"));
			}
		});

	} else {
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const createGrant = async (req, res) => {
	if (req.body && req.body.walletAddress && req.body.password && req.body.capsuleId) {
		// first get address from web3

		const _account = await accountService._getAccountByFilter(req.app, { accountAddress: req.body.walletAddress });
		if (_account == null || _account.password != req.body.password) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		const result = {
			email: _account.email,
			publicKey: _account.publicKey,
			accountAddress: req.body.walletAddress,
			capsuleId: req.body.capsuleId,
		};

		// get the upload info
		const _upload = await uploadService._getUploadByFilter(req.app, { capsuleId: req.body.capsuleId });
		if (_upload == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		if (_upload.accountAddress == result.accountAddress) {
			return res.status(400).json(collection.getErrorResponse("Action not valid"));
		}

		// get uploaders email
		const _uploaderAccount = await accountService._getAccountByFilter(req.app, { accountAddress: _upload.accountAddress });
		if (_uploaderAccount == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// add to db
		const _grant = await grantService._createGrant(req.app, result);
		if (_grant == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// now send and request to 
		_mailClient.sendVanillaMail({ email: _uploaderAccount.email, description: `Please give me access to your uploaded dna data. My email address is ${_grant.email}. My address is ${_grant.accountAddress}. Click on link to process the request ${constant.config.platform.selfLink}/processGrant/${_grant._id}/${_upload._id}` });

		return res.status(200).json({ result: _grant, });
	} else {
		// send the from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const processGrant = async (req, res) => {
	if (req.params && req.params.grantId && req.params.uploadId) {
		// get the upload info
		const _upload = await uploadService._getUploadByFilter(req.app, { _id: req.params.uploadId });
		if (_upload == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// add to db
		const _grant = await grantService._getGrantByFilter(req.app, { _id: req.params.grantId });
		if (_grant == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// now get the account of both
		const _alice = await accountService._getAccountByFilter(req.app, { accountAddress: _upload.accountAddress });
		if (_alice == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		const _bob = await accountService._getAccountByFilter(req.app, { accountAddress: _grant.accountAddress });
		if (_bob == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// call the grant method
		const nucypherDataPayload = await securityClient.grant(_upload.capsuleId, _alice.publicKey, _alice.privateKey, _bob.publicKey);
		if (!nucypherDataPayload) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// push this data on the blockchain
		const payload = {
			policyId: nucypherDataPayload.policy_id,
			capsuleId: nucypherDataPayload.capsule_id,
			signedPublicKey: nucypherDataPayload.alice_signing_pubkey,
			pubKey: nucypherDataPayload.alice_pubkey,
		};

		const contractInstance = await getInstance(req.app);
		const _payload = contractInstance.methods.addGrant(payload.policyId, payload.capsuleId, payload.signedPublicKey, payload.pubKey).encodeABI();
		const trxPayload = {
			from: constant.config.wallet.transferWalletAccountAddress,
			to: constant.CONTRACT_ADDRESS,
			value: _payload,
			methodName: "addGrant",
			privateKey: constant.config.wallet.transferWalletAccountKey,
		};

		// send trx
		const txData = await req.app.web3Helper.sendRawErcTransaction(contractInstance, trxPayload);
		if (!txData.hash) {
			return res.status(400).json(collection.getErrorResponse("Unable to make blockchain transaction"));
		}

		const decryptionPayload = {
			ciphertext: _upload.ciphertext,
			policy_id: payload.policyId,
			capsule_id: payload.capsuleId,
			alice_pubkey: _alice.publicKey,
			bob_pubkey: _bob.publicKey,
			bob_privkey: _bob.privateKey,
			alice_signing_pubkey: payload.signedPublicKey,
			other: {
				hash: txData.hash,
				email: _grant.email
			}
		};

		const stringDecryptionPayload = collection.getStringFromJson(decryptionPayload);

		const decryptKey = collection.getSeed();
		await req.app.redisHelper.set(decryptKey, stringDecryptionPayload);
		await req.app.redisHelper.expire(decryptKey, constant.config.utils.redisExpire);

		// update grant count
		await grantService._updateGrant(req.app, req.params.grantId, Number(_grant.count) + 1);

		// now send and request to 
		_mailClient.sendVanillaMail({ email: _grant.email, description: `Your proxy decryption secret decoder key is ${decryptKey} This key is valid for 10 mins only` });

		return res.status(200).json({ result: true });
	} else {
		// send the from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const decryptData = async (req, res) => {
	if (req.body && req.body.decryptId) {
		const stringData = await req.app.redisHelper.get(req.body.decryptId);
		if (stringData == null) {
			return res.status(400).json(collection.getErrorResponse("Something went wrong"));
		}

		// get decryption payload
		let decryptionPayload = collection.getJsonFromString(stringData);
		const other = decryptionPayload["other"];
		delete decryptionPayload["other"];

		const finalPayload = await securityClient.decrypt(decryptionPayload);
		if (!finalPayload || !finalPayload.decrypted_data) {
			return res.status(400).json(collection.getErrorResponse("Data already decrypted."));
		}

		const fileUrl = `https://ipfs.io/ipfs/${finalPayload.decrypted_data}/`;

		// now send and request to 
		_mailClient.sendVanillaMail({ email: other.email, description: `The DNA file url is : ${fileUrl} Thanks for using the nucypher proxy re-encryption. Blockchain transaction hash for this transaction is ${other.hash}` });

		// delete key
		await req.app.redisHelper.delete(req.body.decryptId);
		return res.status(200).json({
			result: {
				decryptedData: fileUrl
			}
		});
	} else {
		// send the from hash
		return res.status(400).json(collection.getErrorResponse("Something went wrong"));
	}
};

export const getGrants = async (req, res) => {
	const grants = await grantService._findGrants(req.app);
	return res.status(200).json({ result: grants });
};

export const getUploads = async (req, res) => {
	const uploads = await uploadService._findUploads(req.app);
	return res.status(200).json({ result: uploads });
};

const getInstance = async (app) => {
	return new Promise(async (resole) => {
		let contractInstance = null;
		if (!contractHelper.contract["VLD"]) {
			contractInstance = await app.web3Helper.initializeContract(constant.CONTRACT_ADDRESS, constant.BINARY_ABI);
			contractHelper.addContract("VLD", contractInstance);
		} else {
			contractInstance = contractHelper.contract["VLD"];
		}
		resole(contractInstance);
	});
};


export const ping = async (req, res) => {

	return res.status(200).json({ result: true });
};