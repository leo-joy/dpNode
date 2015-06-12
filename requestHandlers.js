//var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable= require("formidable");
function startup(response, request) {
	console.log("Request handler 'startup' was called.");
	
	/*function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while(new Date().getTime() < startTime + milliSeconds);
	}
	
	sleep(10000);*/
	
	/*exec("find /",
    {timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
	    response.writeHead(200, {"Content-Type": "text/plain"});
	    response.write(stdout);
	    response.end();
  	});*/
  	 var body = '<html>'+
	    '<head>'+
	    '<meta http-equiv="Content-Type" content="text/html; '+
	    'charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    '<form action="/upload" enctype="multipart/form-data" method="post">'+
	    '<input type="file" name="upload">'+
	    '<input type="submit" value="Upload file" />'+
	    '</form>'+
	    '</body>'+
	    '</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request,function(error, fields, files){
  	console.log("parsing done");
  	fs.renameSync(files.upload.path, "//usr/node/DP/img/test.png");
  	response.writeHead(200,{"Content-Type":"text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
  
}

function show(response, request) {
	console.log("Request handler 'show' was called.");
	fs.readFile('/usr/node/DP/img/test.png', "binary", function(error,file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
		    response.write(error + "\n");
		    response.end();
		}else {
			response.writeHead(200, {"Content-Type": "image/png","Access-Control-Allow-Origin":"*"});
		    response.write(file, "binary");
		    response.end();
		}
	});
}

function getJson(response, request) {
	response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader("X-Powered-By",' 3.2.1')
	response.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
	
	response.write('{"name":"pde"}');
	response.end();
}
exports.startup = startup;
exports.upload = upload;
exports.show = show;
exports.getJson = getJson;

