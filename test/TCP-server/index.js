/**
 * 模块依赖
 */

var net = require("net");

/**
 * 追踪连接数
 */
var count = 0,users = {};

/**
 * 创建服务器
 */
var server = net.createServer(function(conn) {
	//handle connection
	conn.setEncoding('utf8');
	console.log('\033[90m     new connection!\033[39m');
	conn.write(
		'\n > welcome to \033[92mnode-chat\033[39m!\n'+
    	'\n > '+count+' other people are connected at this time.\n'+
    	'\n > please write your name and press enter:'
	);
	count++;
	var nickname;
	function broadcast (msg, exceptMyself) {
		for(var i in users) {
			if(!exceptMyself || i != nickname) {
				users[i].write(msg);
			}
		}
	}
	conn.on('data',function(data){
		data = data.replace('\r\n', '');
		console.log(data);
		if(!nickname) {
			if(users[data]) {
				conn.write('\033[93m> nickname already in use. try again:\033[39m');
				return;
			}else{
				nickname = data;
				users[nickname] = conn;
				
				for(var i in users) {
					broadcast('\033[90m>'+ nickname+' joined the room\033[39m\n');
					if(i != nickname) {
						broadcast('\033[90m>'+ nickname+'\033[39m '+data+'\n',true);
					}
				}
			}
		}
	});
	conn.on('close',function(){
		count--;
		delete users[nickname];
		broadcast('\033[90m>'+ nickname+' left room! \033[39m\n');
	});
	
});

/**
 * 监听
 */

server.listen(3000,function(){
	console.log('\033[96m     server listening on *:3000\033[39m');
});


