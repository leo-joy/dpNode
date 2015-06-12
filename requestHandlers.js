//var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable= require("formidable");
var redis = require('redis');
var http = require('http');
var url = require("url");
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

function getJson(response, req) {
	
	// 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        console.log('数据接收完毕');
        var params = querystring.parse(postData);//GET & POST  ////解释表单数据部分{name="zzl",email="zzl@sina.com"}
        console.log(params);
        console.log(params["name"]);
        PushToRedis(params["name"]);
        response.writeHead(500, {
            "Content-Type": "text/plain;charset=utf-8"
        });
        response.end("数据提交完毕");
    });
    
	//表单接收完成后，再处理redis部分
	function PushToRedis(info) {
	    var client = redis.createClient();
	    client.lpush("topnews", info);
	    console.log("PushToRedis:" + info);
	    client.lpop("topnews", function (i, o) {
	        console.log(o);//回调，所以info可能没法得到o的值，就被res.write输出了
	    })
	    client.quit();
	}
	response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8020");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	response.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
	
	response.write('{"name":"pde"}');
	response.end();
}
exports.startup = startup;
exports.upload = upload;
exports.show = show;
exports.getJson = getJson;

