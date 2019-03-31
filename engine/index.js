//get root folder
const enginePath = require("path").join(__dirname, "");
import engineImport  from "./engineHelper";

const initRouteAndSchema = (app, mongoose) => {
	engineImport(app, enginePath, mongoose);
};

export default initRouteAndSchema;