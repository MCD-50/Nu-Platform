const IPFS = require("ipfs-api");
const node = new IPFS({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
//const node = new IPFS({ host: "localhost", port: 5001, protocol: "http" });

let nodeFactory = null;
export const getNode = () => {
	return new Promise((resolve, reject) => {
		if (nodeFactory) {
			return resolve(nodeFactory);
		}

		nodeFactory = node;
		resolve(nodeFactory);
	});
};
