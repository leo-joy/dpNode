var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
//handle["/"] = requestHandlers.startup;
handle["/startup"] = requestHandlers.startup;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/getJson"] = requestHandlers.getJson;

server.start(router.route,handle);

