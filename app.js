const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(bodyParser.json());


User =require('./models/user');

mongoose.connect('mongodb://localhost/users');
var db = mongoose.connection;


app.get('/api/users', (req, res) => {
	User.getPersons((err, persons) => {
		try{
			console.log('show');
		}
		catch(err){
			console.log('error: ' + err);
		}
		
		res.json(persons);
	});
});

app.post('/api/users', (req, res) => {
	var user = req.body;
	User.addUser(user, (err, user) => {
		try{
			console.log('add');
		}
		catch(err){
			console.log('error: ' + err);
		}
		res.json(user);
	});
});


app.listen(3000);
console.log('Port 3000');



var cache = require('memory-cache');

cache.put('Cache', 'disappear', 100, function(key, value) {
    console.log(key + ' did ' + value);
}); 

setTimeout(function() {
    console.log('Cache is ' + cache.get('cache'));
}, 3000);
 
var newCache = new cache.Cache();
 
newCache.put('foo', 'start');
 
setTimeout(function() {
  console.log('New cache ' + newCache.get('foo'));
}, 3000);