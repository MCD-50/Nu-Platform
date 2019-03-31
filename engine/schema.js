//get root folder
const schemaPath = require("path").join(__dirname, "../schema");
import engineImport  from "./engineHelper";

const schema = (app, mongoose) => {
	engineImport(app, schemaPath, mongoose);
};

export default schema;
