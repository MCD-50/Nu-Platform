export const _createUpload = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Uploads;
		db.create(payload, (err, success) => {
			if (!success || err) {
				return resolve(null);
			}
			resolve(success);
		});
	});
};

export const _getUpload = (app, objectId) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Uploads;
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

export const _getUploadByFilter = (app, payload) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Uploads;
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

export const _findUploads = (app, payload = {}) => {
	return new Promise((resolve, reject) => {
		const db = app.db.models.Uploads;
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