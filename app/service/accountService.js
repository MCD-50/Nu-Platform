export const _createAccount = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Accounts;
		db.create(payload, (err, success) => {
			if (!success || err) {
				return resolve(null);
			}
			resolve(success);
		});
	});
};


export const _getAccount = (app, objectId) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Accounts;
		db.findOne({ _id: objectId })
			.lean()
			.exec((err, success) => {
				if (!success || err) {
					return resolve(null);
				}
				resolve(success);
			});
	});
};

export const _getAccountByFilter = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Accounts;
		db.findOne(payload)
			.lean()
			.exec((err, success) => {
				if (!success || err) {
					return resolve(null);
				}
				resolve(success);
			});
	});
};