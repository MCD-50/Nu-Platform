const schema = {
	accountAddress: {
		type: String,
		required: true
	},
	detail: {
		type: String,
		required: true
	},
	capsuleId: {
		type: String,
		required: true,
		unique: true,
	},
	ciphertext: {
		type: String,
		required: true,
	},
	transactionHash: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
};

const depositSchema = (app, mongoose) => {
	const _schema = schema;

	let DepositSchema = new mongoose.Schema(_schema);
	DepositSchema.plugin(require("./plugins/pagedFind"));
	DepositSchema.index({ _id: 1, transactionHash: 1 });
	app.db.model("Uploads", DepositSchema);
};

export default depositSchema;