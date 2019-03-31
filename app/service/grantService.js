export const _createGrant = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Grants;
		db.create(payload, (err, success) => {
			if (!success || err) {
				return resolve(null);
			}
			resolve(success);
		});
	});
};

export const _getGrant = (app, objectId) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Grants;
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

export const _updateGrant = (app, objectId, count) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Grants;
		db.findOne({ _id: objectId }, (err, success) => {
			if (!success || err) {
				return resolve(null);
			}
			success["count"] = count;
			success.save();
			resolve(success.toObject());
		});
	});
};

export const _getGrantByFilter = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Grants;
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

export const _findGrants = (app, payload = {}) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Grants;
		db.find(payload)
			.lean()
			.exec((err, success) => {
				if (!success || err) {
					return resolve(null);
				}
				resolve(success);
			});
	});
};