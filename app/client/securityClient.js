import * as internet from "../helper/internet";

export const genkey = async () => {
	return new Promise(async (resolve, reject) => {
		const encryptedHashPayload = await internet.makePlatformRequest("gen_keys", "get");
		resolve(encryptedHashPayload);
	});
};

export const grant = async (capsuleId, pubKey, privKey, bobPubKey) => {
	return new Promise(async (resolve, reject) => {
		const encryptedHashPayload = await internet.makePlatformRequest("grant", "post", { capsule_id: capsuleId, alice_pubkey: pubKey, alice_privkey: privKey, bob_pubkey: bobPubKey });
		resolve(encryptedHashPayload);
	});
};

export const encrypt = async (ipfsHash, pubKey, privKey) => {
	return new Promise(async (resolve, reject) => {
		const encryptedHashPayload = await internet.makePlatformRequest("encrypt", "post", { hash: ipfsHash, alice_pubkey: pubKey, alice_privkey: privKey });
		resolve(encryptedHashPayload);
	});
};

export const decrypt = async (payload) => {
	return new Promise(async (resolve, reject) => {
		const decryptedHash = await internet.makePlatformRequest("decrypt", "post", { ...payload });
		resolve(decryptedHash);
	});
};