const schema = {
	accountAddress: {
		type: String,
		required: true,
		unique: true
	},
	email : {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	publicKey : {
		type: String,
		required: true,
		unique: true
	},
	privateKey: {
		type: String,
		required: true,
		unique: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
};

const accountSchema = (app, mongoose) => {
	const _schema = schema;

	let AccountSchema = new mongoose.Schema(_schema);
	AccountSchema.plugin(require("./plugins/pagedFind"));
	AccountSchema.index({ _id: 1, accountAddress: 1 });
	app.db.model("Accounts", AccountSchema);
};

export default accountSchema;