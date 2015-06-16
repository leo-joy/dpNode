/*var fs = require("fs");
//同步
//console.log(fs.readdirSync("."));
//异步
//function async(err,files) {console.log(files);};
//fs.readdir(".", async);
*/
var fs = require('fs'),
    stdin = process.stdin,
    stdout = process.stdout,
    _files = [],
    _stats = [];
fs.readdir(process.cwd(), function(err,files) {
	console.log('');
	if(!files.length) {
		return console.log('      \033[31m No files to show!\033[39m\n]]');
	}
	
	console.log('    Select which file or directory you want to see\n');
	_files = files;
	file(0);
});



//called for each file walked in the directoy
function file(i) {
	var filename = _files[i];
	
	fs.stat(__dirname + '/' +filename, function(err,stat) {
		_stats[i] = stat;
		if(stat.isDirectory()) {
			console.log('      '+ i +'    \033[36m' + filename + '/\033[39m');
		}else {
			console.log('      '+ i +'    \033[90m' + filename + '\033[39m');
		}
		if(++i == _files.length) {
			read();
		}else {
			file(i);
		}
	});
}

//read user input when files are shown
function read() {
	console.log("");
	stdout.write('    \033[33mEnter you choice: \033[39m');
	stdin.resume();
	stdin.setEncoding('utf8');
	stdin.on('data',option);
}

//called with the options supplied by the user
function option(data) {
	console.log("data:"+data);
	var filename = _files[Number(data)];
	console.log("filename:"+filename);
	if(!filename) {
		stdout.write('     \033[31mEnter your choice: \033[39m');
	}else {
		stdin.pause();
		if(_stats[Number(data)].isDirectory()) {
			fs.readdir(__dirname + '/' + filename,function(err,files) {
				console.log('');
				console.log('    (' + files.length + '  files)');
				files.forEach(function(file) {
					console.log('      -  ' + file);
				});
				console.log('');
			})
		}else {
			fs.readFile(__dirname + '/' +filename, 'utf8', function(err, data){
				console.log('');
				console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39M');
			});
		}		
	}
}


