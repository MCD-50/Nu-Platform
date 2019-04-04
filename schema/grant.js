const schema = {
	capsuleId: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	accountAddress: {
		type: String,
		required: true,
	},
	publicKey: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		default: 0
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

const metaSchema = (app, mongoose) => {
	const _schema = schema;

	let MetaSchema = new mongoose.Schema(_schema);
	MetaSchema.plugin(require("./plugins/pagedFind"));
	MetaSchema.index({ _id: 1 });
	app.db.model("Grants", MetaSchema);
};

export default metaSchema;