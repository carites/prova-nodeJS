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
var crypto = require('crypto');
app.use(bodyParser());
var router = express.Router();

sql.connect();

app.get('/',function(req,res){
	res.send('hello word');
});

router.route('/users')

.post(function(req, res) {
	var password = req.body.password;
	var shasum = crypto.createHash('sha1');
	shasum.update(password);
	password = shasum.digest('hex');
	sql.query('INSERT INTO user_node (username,password) VALUES(\''+req.body.username+'\',\''+password+'\')',function(err,result){
		if (err) throw err;

		if(result){
			res.type('application/json');
			res.send([{"result":"true"}]);
		}
	});
})

.get(function(req, res) {
	var results;
	sql.query('SELECT * FROM user_node', function(err, rows, fields) {
	  if (err) throw err;

	  results = rows;
		res.type('application/json');
		res.send(results);
	});

});
router.route('/users/:id')

.put(function(req, res) {
	var password = req.body.password;
	var shasum = crypto.createHash('sha1');
	shasum.update(password);
	password = shasum.digest('hex');
	sql.query('UPDATE user_node SET username = \''+req.body.username+'\', password = \''+password+'\' where id = '+req.params.id, function(err,result) {
	  if (err) throw err;

	  if(result)
	  	res.type('application/json');
	  	res.send([{"updated":1}]);
	});
})

.get(function(req, res) {
	var results;
	sql.query('SELECT * FROM user_node WHERE id='+req.params.id, function(err, rows, fields) {
	  if (err) throw err;

	  results = rows;
		res.type('application/json');
		res.send(results);
	});
})
app.use('/api', router);
app.listen(3000);