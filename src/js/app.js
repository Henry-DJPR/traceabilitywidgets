// Modules
import * as bootstrap from "bootstrap";
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
