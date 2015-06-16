/**
 * 模块依赖
 */

var net = require("net");

/**
 * 追踪连接数
 */
var count = 0,users = {};

/**
 * 创建客户端
 */
var client = net.connect(6667,'irc.freenode.net');
client.on('connet',function(){
	client.write('NICK mynick\r\n');
	client.write('USER mynick 0 * :readname\r\n');
	client.write('JOIN #node.js\r\n');
});

client.setEncoding('utf8');




