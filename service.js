var express = require('express'),
	bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var sql = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	database :'provanode',
	password : 'root',
	port :8889,
	socket : '/Applications/MAMP/tmp/mysql/mysql.sock'

});

app.use(bodyParser());
var router = express.Router();

sql.connect();

app.get('/',function(req,res){
	res.send('hello word');
});

app.post('/user',function(req,res){

	sql.query('INSERT INTO user_node (username,password) VALUES(\''+req.body.username+'\',\''+req.body.password+'\')',function(err,result){
		if (err) throw err;

		if(result){
			res.type('application/json');
			res.send([{"result":"true"}]);
		}
	});
});
app.listen(3000);