/*require("http").createServer(function(req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("<h1>hello world</h1>");
}).listen(3100);*/
var net = require('net');

var server = net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
