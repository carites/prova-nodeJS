var express = require('express'),
	bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var Sequelize = require('sequelize');
app.use(bodyParser());

var env = "dev";
var config = require('./database.json')[env];
// CONFIGURAZIONE DB CON SEQUELIZE
var sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		host : config.host,
		port : config.port,
		dialect: config.driver,
		logging: console.log,
		define: {
			timestamps: false
		}
	}
);

var DataTypes = require("sequelize");
var crypto = require('crypto');

var router = express.Router();
//MODEL PER LA TABELLA USER_NODE
var User = sequelize.define('user_node',{
		username: DataTypes.STRING,
		password: DataTypes.STRING
	},
	{
		instanceMethods:{
			getAll : function(onSuccess, onError) 
			{
				User.findAll({}, {raw: true}).then(onSuccess).catch(onError);
	  		},
			getById: function(user_id, onSuccess, onError) 
			{
				User.find({where: {id: user_id}}, {raw: true}).then(onSuccess).catch(onError);
			},
			newUser: function(onSuccess, onError) 
			{
				var username = this.username;
				var password = this.password;

				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				password = shasum.digest('hex');

				User.build({ username: username, password: password })
				    .save().then(onSuccess).catch(onError);
			},
			update: function(user_id, onSuccess, onError) 
			{
				var id = user_id;
				var username = this.username;
				var password = this.password;

				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				password = shasum.digest('hex');

				User.update({ username: username,password: password},{where: {id: id} }).then(onSuccess).catch(onError);
			}
		},
		freezeTableName: true,

  		tableName: 'user_node'
	});
//FINE MODEL

app.get('/',function(req,res){
	res.send('hello word');
});
//ROUTES PER LE CHIAMATE SENZA ID
router.route('/users')

.post(function(req, res) {
	var username = req.body.username; 
	var password = req.body.password;
	var user = User.build({username: username, password: password});

	user.newUser(function(success){
		res.json({result : "true"})
	},
	function(error){
		res.send(error);
	});
})

.get(function(req, res) {
	var user = User.build();

	user.getAll(function(users) {
		if (users) {
		  res.json(users);
		} else {
		  res.send(401, "User not found");
		}
	  }, function(error) {
		res.send("User not found");
	  });

});

//ROUTES PER LE CHIAMATE CHE RICHIEDONO ID
router.route('/users/:id')

.put(function(req, res) {
	var user = User.build();

	user.username = req.body.username;
	user.password = req.body.password;

	user.update(req.params.id, function(success) {
		console.log(success);
		if (success) {
			res.json({ message: 'User updated!' });
		} else {
		  res.send(401, "User not found");
		}
	  }, function(error) {
		res.send("User not found");
	  });

})

.get(function(req, res) {
	var user = User.build();

	user.getById(req.params.id, function(users) {
		if (users) {
		  res.json(users);
		} else {
		  res.send(401, "User not found");
		}
	  }, function(error) {
		res.send("User not found");
	  });
})
//ROOT PER LE ROUTES
app.use('/api', router);
//PORTA DEL SERVER
app.listen(3000);